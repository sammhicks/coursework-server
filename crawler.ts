"use strict";

import * as fs from "fs";
import { DirectoryHandler, ErrorHandler, FileHandler, Handler, LeafHandler } from "./handlers";
import * as path from "path";
import * as url from "url";

class DirectoryContents {
  directories: string[];
  files: string[];
  aliases: { [name: string]: string };

  constructor(serverPath) {
    this.directories = [];
    this.files = [];
    this.aliases = {};

    const contents = fs.readdirSync(serverPath);

    let categorisedContents: { [category: string]: string[] } = {};

    for (let item of contents) {
      const fullPath = path.resolve(serverPath, item);

      const category = fs.statSync(fullPath).mode & fs.constants.S_IFMT;

      if (category in categorisedContents) {
        categorisedContents[category].push(item);
      } else {
        categorisedContents[category] = [item];
      }
    };

    this.directories = categorisedContents[fs.constants.S_IFDIR] || [];

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

export class Crawler {
  crawl(serverPath: string): Handler {
    console.log("Directory: ", serverPath);

    let contents = new DirectoryContents(serverPath);

    let directoryHandlers: { [Directory: string]: Handler } = {};

    for (let directory of contents.directories) {
      const directoryPath = path.resolve(serverPath, directory);

      directoryHandlers[directory] = this.crawl(directoryPath);
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
}