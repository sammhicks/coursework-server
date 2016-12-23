"use strict";

const http = require("http");
const DatabaseHandler = require("./database-handler").DatabaseHandler;
const DirectoryHandler = require("./directory-handler").DirectoryHandler;
const DomainHandler = require("./domain-handler").DomainHandler;
const HelloWorldHandler = require("./hello-world-handler").HelloWorldHandler;
const LeafHandler = require("./leaf-handler").LeafHandler;
const Request = require("./request").Request;

const port = process.env.PORT || 8080;

const databaseHandler = new LeafHandler(new DatabaseHandler());
const helloWorldhandler = new LeafHandler(new HelloWorldHandler());

const rootHandler = new DirectoryHandler({
  "": databaseHandler,
  "hello.txt": helloWorldhandler
});

const domainHandler = new DomainHandler({
  "localhost": rootHandler
});

var server = http.createServer(function requestListener(request, response) {
  domainHandler.handleRequest(new Request(request, response));
}).listen(port);
