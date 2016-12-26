"use strict";

const Handler = require("./handler").Handler;

class ErrorHandler extends Handler {
  constructor(handler, catcher) {
    super();

    this.handler = handler;
    this.catcher = catcher;
  }

  handleRequest(request) {
    return this.handler.handleRequest(request).catch(this.catcher);
  }
}

exports.ErrorHandler = ErrorHandler;