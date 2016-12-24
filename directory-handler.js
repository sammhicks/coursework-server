"use strict";

const Handler = require("./handler").Handler;
const HttpStatus = require("http-status-codes");

class DirectoryHandler extends Handler {
  constructor(contents) {
    super();

    this.contents = contents;
  }

  handleRequest(request) {
    if (request.path.length === 0) {
      request.errorCode = HttpStatus.NOT_FOUND;
      return Promise.reject(request);
    } else {
      const directory = request.path.shift();

      if (directory in this.contents) {
        return this.contents[directory].handleRequest(request);
      } else {
        request.errorCode = HttpStatus.NOT_FOUND;
        return Promise.reject(request);
      }
    }
  }
}

exports.DirectoryHandler = DirectoryHandler;
