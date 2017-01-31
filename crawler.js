"use strict";

const fs = require("fs");
const handlers = require("./handlers");
const path = require('path');
const url = require("url");

class Contents {
  constructor(serverPath) {
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

    this.domains = {};
    this.directories = [];

    for (var directory of directories) {
      const domainInfo = /(.*).domain/.exec(directory);

      if (domainInfo === null) {
        this.directories.push(directory);
      } else {
        this.domains[domainInfo[1]] = directory;
      }
    }

    this.files = categorisedContents[fs.constants.S_IFREG] || [];
  }
}

function crawlDomain(serverPath) {
  console.log("Domain: ", serverPath);

  const contents = new Contents(serverPath);

  var domainHandlers = {};

  for (var domain in contents.domains) {
    const domainPath = path.resolve(serverPath, contents.domains[domain]);

    domainHandlers[domain] = crawlDomain(domainPath);
  }

  if (contents.directories.length > 0 || contents.files.length > 0) {
    domainHandlers[""] = new handlers.RootDomain(crawlDirectory(serverPath));
  }

  return new handlers.Domain(domainHandlers);
}

function crawlDirectory(serverPath) {
  console.log("Directory: ", serverPath);
  const contents = new Contents(serverPath);

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

  return new handlers.Directory(directoryHandlers);
}

exports.crawl = crawlDomain;
