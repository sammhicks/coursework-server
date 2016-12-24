"use strict"

const Handler = require("./handler").Handler;
const HttpStatus = require("http-status-codes");

class RootDomainHandler extends Handler {
  constructor(handler) {
    super();

    this.handler = handler;
  }

  handleRequest(request) {
    if (request.domain.length === 0) {
      return this.handler.handleRequest(request);
    } else {
      return Promise.reject(request);
    }
  }
}

exports.RootDomainHandler = RootDomainHandler;
