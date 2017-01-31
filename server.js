"use strict";

const http = require("http");
const crawler = require("./crawler");
const handlers = require("./handlers");
const Request = require("./request").Request;

const port = process.env.PORT || 8080;

/*const databaseHandler = new handlers.Leaf(new handlers.Database());
const helloWorldHandler = new handlers.Leaf(new handlers.HelloWorld());

const rootHandler = new handlers.Directory({
  "": databaseHandler,
  "hello.txt": helloWorldHandler
});

const domainHandler = new handlers.Domain({
  "localhost": new handlers.Domain({
    "": new handlers.RootDomain(rootHandler),
    "hello": helloWorldHandler
  })
});*/

const crawledHandler = crawler.crawl("server");

const errorHandler = new handlers.Error(crawledHandler, function (request) {
  return handlers.Handler.handleRequest(request);
});

var server = http.createServer(function requestListener(request, response) {
  errorHandler.handleRequest(new Request(request, response));
}).listen(port);
