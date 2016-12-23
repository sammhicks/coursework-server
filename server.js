"use strict";

const http = require("http");
const DatabaseHandler = require("./database-handler").DatabaseHandler;
const DirectoryHandler = require("./directory-handler").DirectoryHandler;
const HelloWorldHandler = require("./hello-world-handler").HelloWorldHandler;
const Request = require("./request").Request;

const port = process.env.PORT || 8080;

const databaseHandler = new DatabaseHandler();
const helloWorldhandler = new HelloWorldHandler();

const rootHandler = new DirectoryHandler({
  "": databaseHandler,
  "hello.txt": helloWorldhandler
});

var server = http.createServer(function requestListener(request, response) {
  rootHandler.handleRequest(new Request(request, response));
}).listen(port);
