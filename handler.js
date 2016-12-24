"use strict";

const HttpStatus = require("http-status-codes");

class Handler {
  static handleRequest(request) {
    if (request.errorCode === undefined) {
      request.errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    request.response.setHeader("Content-Type", "text/plain");

    request.response.writeHead(request.errorCode);

    request.response.end(HttpStatus.getStatusText(request.errorCode) + "\n");

    return Promise.resolve();
  }
}

exports.Handler = Handler;
