"use strict";

const http = require("http");
const DatabaseHandler = require("./database-handler").DatabaseHandler;
const DirectoryHandler = require("./directory-handler").DirectoryHandler;
const Request = require("./request").Request;

const port = process.env.PORT || 8080;

const databaseHandler = new DatabaseHandler();
const rootHandler = new DirectoryHandler({
  "": databaseHandler
});

var server = http.createServer(function requestListener(request, response) {
  rootHandler.handleRequest(new Request(request, response));
}).listen(port);
