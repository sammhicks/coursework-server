"use strict";

const HttpStatus = require("http-status-codes");

class Handler {
  static handleRequest(request, code) {
    if (code === undefined) {
      return handleRequest(request, HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      request.response.setHeader("Content-Type", "text/plain");

      request.response.writeHead(code);

      request.response.end(HttpStatus.getStatusText(code) + "\n");

      return Promise.resolve();
    }
  }
}

exports.Handler = Handler;
