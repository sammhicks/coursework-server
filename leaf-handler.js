"use strict"

const Handler = require("./handler").Handler;
const HttpStatus = require("http-status-codes");

class LeafHandler extends Handler {
  constructor(handler) {
    super();

    this.handler = handler;
  }

  handleRequest(request) {
    if (request.path.length === 0 || (request.path.length === 1 && request.path[0] ==="")) {
      return this.handler.handleRequest(request);
    } else {
      return Promise.reject(request);
    }
  }
}

exports.LeafHandler = LeafHandler;
