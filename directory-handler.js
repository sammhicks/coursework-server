"use strict";

const Handler = require("./handler").Handler;
const HttpStatus = require("http-status-codes");

const firstDirectoryRegex = /^\/([^\/]*)(.*)$/;

class DirectoryHandler extends Handler {
  constructor(contents, fallback) {
    super();

    this.contents = contents;
    this.fallback = fallback;
  }

  handleRequest(request) {
    const pathComponents = firstDirectoryRegex.exec(request.path);

    if (pathComponents === null) {
      super.handleRequest(request, HttpStatus.BAD_REQUEST);
    } else {
      const directory = pathComponents[1];

      if (directory in this.contents) {
        request.path = pathComponents[2];
        this.contents[directory].handleRequest(request);
      } else if (this.fallback != undefined) {
        fallback.handleRequest(request);
      } else {
        super.handleRequest(request, HttpStatus.NOT_FOUND);
      }
    }
  }
}

exports.DirectoryHandler = DirectoryHandler;
