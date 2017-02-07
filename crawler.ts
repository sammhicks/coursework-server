"use strict";

import * as fs from "fs";
import { DirectoryHandler, ErrorHandler, mimeTypes, FileHandler, Handler, LeafHandler } from "./handlers";
import * as path from "path";
import * as url from "url";

interface Configuration {
  namedHandlers?: { [name: string]: Handler }
  namedHandlerFactories?: { [name: string]: (configuration: Configuration) => Handler }
}

class DirectoryContents {
  directories: string[];
  files: string[];
  aliases: { [name: string]: string };
  namedHandlers: { [name: string]: string }

  constructor(serverPath: string) {
    this.directories = [];
    this.files = [];
    this.aliases = {};
    this.namedHandlers = {};

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

        console.log("Meta:", metaPath);
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

        this.aliases = meta.aliases || {};
        this.namedHandlers = meta.namedHandlers || {};
      } else if (path.extname(file) in mimeTypes) {
        this.files.push(file);
      } else {
        console.log("Ignoring file \"", path.resolve(serverPath, file), "\"");
      }
    }
  }
}

export class Crawler {
  crawl(serverPath: string, configuration: Configuration): Handler {
    console.log("Directory:", serverPath);

    let contents = new DirectoryContents(serverPath);

    let directoryHandlers: { [Directory: string]: Handler } = {};

    for (let directory of contents.directories) {
      const directoryPath = path.resolve(serverPath, directory);

      directoryHandlers[directory] = this.crawl(directoryPath, configuration);
    }

    for (let file of contents.files) {
      const filePath = path.resolve(serverPath, file);

      console.log("File:", filePath);

      directoryHandlers[file] = new LeafHandler(new FileHandler(filePath));
    }

    for (let namedHandler in contents.namedHandlers) {
      let fileName = contents.namedHandlers[namedHandler];
      if (fileName in configuration.namedHandlers) {
        directoryHandlers[namedHandler] = configuration.namedHandlers[fileName];
      } else {
        console.error("Cannot find handler for \"", fileName, "\" in \"", serverPath, "\"");
      }
    }

    for (let alias in contents.aliases) {
      let target = contents.aliases[alias];
      if (target in directoryHandlers) {
        directoryHandlers[alias] = directoryHandlers[target];
      } else {
        console.error("Cannot find handler for \"", target, "\" in \"", serverPath, "\"");
      }
    }

    return new DirectoryHandler(directoryHandlers);
  }
}