"use strict";

import { IncomingMessage, ServerResponse, createServer } from "http";
import { Crawler } from "./crawler";
import { DirectoryHandler, Error, ErrorHandler, FileHandler, Handler, LeafHandler } from "./handlers";
import { Request } from "./request";

const port: number = process.env.PORT || 8080;

const crawledHandler = new Crawler().crawl("server");

const errorHandler = new ErrorHandler(crawledHandler, (error: Error) => Handler.handleError(error.request, error.errorCode));

const server = createServer(function requestListener(request: IncomingMessage, response: ServerResponse) {
  errorHandler.handleRequest(new Request(request, response));
});

server.on("listening", function serverListen() {
  console.log("Server listening on %d", port);
});

server.listen(port);
