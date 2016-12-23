"use strict";

const HttpStatus = require("http-status-codes");

class Handler {
  handleRequest(request, code) {
    if (code === undefined) {
      handleRequest(request, HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      request.response.setHeader("Content-Type", "text/plain");

      request.response.writeHead(code);

      request.response.end(HttpStatus.getStatusText(code) + "\n");
    }
  }
}

exports.Handler = Handler;
