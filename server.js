"use strict";

const http = require("http");
const DatabaseHandler = require("./database-handler").DatabaseHandler;
const Request = require("./request").Request;

const port = process.env.PORT || 8080;

const handler = new DatabaseHandler();

var server = http.createServer(function requestListener(request, response) {
  handler.handleRequest(new Request(request, response));
}).listen(port);
