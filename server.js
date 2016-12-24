﻿"use strict";

const http = require("http");
const DatabaseHandler = require("./database-handler").DatabaseHandler;
const DirectoryHandler = require("./directory-handler").DirectoryHandler;
const DomainHandler = require("./domain-handler").DomainHandler;
const ErrorHandler = require("./error-handler").ErrorHandler;
const Handler = require("./handler").Handler;
const HelloWorldHandler = require("./hello-world-handler").HelloWorldHandler;
const HttpStatus = require("http-status-codes");
const LeafHandler = require("./leaf-handler").LeafHandler;
const RootDomainHandler = require("./root-domain-handler").RootDomainHandler;
const Request = require("./request").Request;

const port = process.env.PORT || 8080;

const databaseHandler = new LeafHandler(new DatabaseHandler());
const helloWorldHandler = new LeafHandler(new HelloWorldHandler());

const rootHandler = new DirectoryHandler({
  "": databaseHandler,
  "hello.txt": helloWorldHandler
});

const domainHandler = new DomainHandler({
  "localhost": new DomainHandler({
    "": new RootDomainHandler(rootHandler),
    "hello": helloWorldHandler
  })
});

const errorHandler = new ErrorHandler(domainHandler, function (request) {
  return Handler.handleRequest(request);
});

var server = http.createServer(function requestListener(request, response) {
  errorHandler.handleRequest(new Request(request, response));
}).listen(port);
