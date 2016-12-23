"use strict"

const url = require('url');

class Request {
  constructor(request, response) {
    this.request = request;
    this.response = response;

    var requestURL = url.parse(request.url, true);

    this.path = requestURL.path;
    this.query = requestURL.query;
  }
}

exports.Request = Request;
