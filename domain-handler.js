"use strict";

const Handler = require("./handler").Handler;
const HttpStatus = require("http-status-codes");

class DomainHandler extends Handler {
  constructor(domains) {
    this.domains = domains;
  }

  handleRequest(request) {
    if (request.domain.length === 0) {
      super.handleRequest(request, HttpStatus.NOT_FOUND);
    } else {
      const domain = request.domain.pop();

      if (domain in this.domains) {
        this.domains[domain].handleRequest(request);
      } else {
        super.handleRequest(request, HttpStatus.NOT_FOUND);
      }
    }
  }
}

exports.DomainHandler = DomainHandler;
