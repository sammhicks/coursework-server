"use strict";

const Handler = require("./handler").Handler;
const HttpStatus = require("http-status-codes");

class DomainHandler extends Handler {
  constructor(domains) {
    super();

    this.domains = domains;
  }

  handleRequest(request) {
    if (request.domain.length === 0) {
      if ("" in this.domains) {
        return this.domains[""].handleRequest(request);
      } else {
        return Promise.reject(request);
      }
    } else {
      const domain = request.domain.pop();

      if (domain in this.domains) {
        return this.domains[domain].handleRequest(request);
      } else {
        return Promise.reject(request);
      }
    }
  }
}

exports.DomainHandler = DomainHandler;
