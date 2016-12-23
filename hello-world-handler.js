"use strict"

const Handler = require("./handler").Handler;
const HttpStatus = require("http-status-codes");

class HelloWorldHandler extends Handler {
  handleRequest(request) {
    request.response.setHeader("Content-Type", "text/plain");

    request.response.writeHead(HttpStatus.OK);

    request.response.end("Hello World\n");
  }
}

exports.HelloWorldHandler = HelloWorldHandler;
