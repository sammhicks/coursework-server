"use strict";

import * as fs from "fs";
import { DirectoryHandler, DomainHandler, ErrorHandler, FileHandler, Handler, LeafHandler, RootDomainHandler } from "./handlers";
import * as path from "path";
import * as url from "url";

export namespace Crawler {
  class Contents {
    domains: { [domain: string]: string };
    directories: string[];
    files: string[];
    aliases: { [domain: string]: string };

    constructor(serverPath) {
      this.domains = {};
      this.directories = [];
      this.files = [];
      this.aliases = {};

      const contents = fs.readdirSync(serverPath);

      let categorisedContents = {};

      for (let item of contents) {
        const fullPath = path.resolve(serverPath, item);

        const category = fs.statSync(fullPath).mode & fs.constants.S_IFMT;

        if (category in categorisedContents) {
          categorisedContents[category].push(item);
        } else {
          categorisedContents[category] = [item];
        }
      };

      const directories = categorisedContents[fs.constants.S_IFDIR] || [];

      for (let directory of directories) {
        const domainInfo = /(.*).domain/.exec(directory);

        if (domainInfo === null) {
          this.directories.push(directory);
        } else {
          this.domains[domainInfo[1]] = directory;
        }
      }

      const files = categorisedContents[fs.constants.S_IFREG] || [];

      for (let file of files) {
        if (file === "meta.json") {
          const metaPath = path.resolve(serverPath, file);

          console.log("Meta: ", metaPath);
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

          this.aliases = meta.aliases || {};
        } else {
          this.files.push(file);
        }
      }
    }
  }

  function crawlDomain(serverPath: string, domainContents?: Contents) {
    console.log("Domain: ", serverPath);

    const contents = domainContents || new Contents(serverPath);

    let domainHandlers = {};

    for (let domain in contents.domains) {
      const domainPath = path.resolve(serverPath, contents.domains[domain]);

      domainHandlers[domain] = crawlDomain(domainPath);
    }

    if (contents.directories.length > 0 || contents.files.length > 0) {
      domainHandlers[""] = new RootDomainHandler(crawlDirectory(serverPath, contents));
    }

    return new DomainHandler(domainHandlers);
  }

  function crawlDirectory(serverPath: string, directoryContents?: Contents) {
    console.log("Directory: ", serverPath);
    const contents = directoryContents || new Contents(serverPath);

    let directoryHandlers = {};

    for (let directory of contents.directories) {
      const directoryPath = path.resolve(serverPath, directory);

      directoryHandlers[directory] = crawlDirectory(directoryPath);
    }

    for (let file of contents.files) {
      const filePath = path.resolve(serverPath, file);

      console.log("File: ", filePath);

      directoryHandlers[file] = new LeafHandler(new FileHandler(filePath));
    }

    for (let alias in contents.aliases) {
      directoryHandlers[alias] = directoryHandlers[contents.aliases[alias]];
    }

    return new DirectoryHandler(directoryHandlers);
  }

  export function crawl(serverPath: string) {
    return crawlDomain(serverPath);
  }
}