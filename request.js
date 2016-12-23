"use strict"

const url = require('url');

class Request {
  constructor(request, response) {
    this.request = request;
    this.response = response;

    var requestURL = url.parse(request.url, true);

    this.path = requestURL.path.split("/").slice(1);
    this.query = requestURL.query;

    var domainURL = url.parse("http://" + request.headers.host);

    this.domain = domainURL.hostname.split(".");
  }
}

exports.Request = Request;
