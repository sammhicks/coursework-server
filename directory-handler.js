"use strict";

const Handler = require("./handler").Handler;
const HttpStatus = require("http-status-codes");

class DirectoryHandler extends Handler {
  constructor(contents, fallback) {
    super();

    this.contents = contents;
    this.fallback = fallback;
  }

  handleRequest(request) {
    if (request.path.length === 0) {
      super.handleRequest(request, HttpStatus.NOT_FOUND);
    } else {
      const directory = request.path.shift();

      if (directory in this.contents) {
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
