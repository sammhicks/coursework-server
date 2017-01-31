"use strict";

const fs = require("fs");
const handlers = require("./handlers");
const path = require("path");
const url = require("url");

class Contents {
  constructor(serverPath) {
    this.domains = {};
    this.directories = [];
    this.files = [];
    this.aliases = {};

    const contents = fs.readdirSync(serverPath);

    var categorisedContents = {};

    for (var item of contents) {
      const fullPath = path.resolve(serverPath, item);

      const category = fs.statSync(fullPath).mode & fs.constants.S_IFMT;

      if (category in categorisedContents) {
        categorisedContents[category].push(item);
      } else {
        categorisedContents[category] = [item];
      }
    };

    const directories = categorisedContents[fs.constants.S_IFDIR] || [];

    for (var directory of directories) {
      const domainInfo = /(.*).domain/.exec(directory);

      if (domainInfo === null) {
        this.directories.push(directory);
      } else {
        this.domains[domainInfo[1]] = directory;
      }
    }

    const files = categorisedContents[fs.constants.S_IFREG] || [];

    for (var file of files) {
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

function crawlDomain(serverPath, domainContents) {
  console.log("Domain: ", serverPath);

  const contents = domainContents || new Contents(serverPath);

  var domainHandlers = {};

  for (var domain in contents.domains) {
    const domainPath = path.resolve(serverPath, contents.domains[domain]);

    domainHandlers[domain] = crawlDomain(domainPath);
  }

  if (contents.directories.length > 0 || contents.files.length > 0) {
    domainHandlers[""] = new handlers.RootDomain(crawlDirectory(serverPath, contents));
  }

  return new handlers.Domain(domainHandlers);
}

function crawlDirectory(serverPath, directoryContents) {
  console.log("Directory: ", serverPath);
  const contents = directoryContents || new Contents(serverPath);

  var directoryHandlers = {};

  for (var directory of contents.directories) {
    const directoryPath = path.resolve(serverPath, directory);

    directoryHandlers[directory] = crawlDirectory(directoryPath);
  }

  for (var file of contents.files) {
    const filePath = path.resolve(serverPath, file);

    console.log("File: ", filePath);

    directoryHandlers[file] = new handlers.Leaf(new handlers.File(filePath));
  }

  for (var alias in contents.aliases) {
    directoryHandlers[alias] = directoryHandlers[contents.aliases[alias]];
  }

  return new handlers.Directory(directoryHandlers);
}

exports.crawl = crawlDomain;
