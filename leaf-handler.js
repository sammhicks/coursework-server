"use strict"

const Handler = require("./handler").Handler;
const HttpStatus = require("http-status-codes");

class LeafHandler extends Handler {
  constructor(handler) {
    super();

    this.handler = handler;
  }

  handleRequest(request) {
    if (request.path.length === 0) {
      this.handler.handleRequest(request);
    } else {
      super.handleRequest(request, HttpStatus.NOT_FOUND);
    }
  }
}

exports.LeafHandler = LeafHandler;
