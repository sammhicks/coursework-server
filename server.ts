"use strict";

import { handlers } from "./server/html-handlers";
import { Error, ErrorHandler, Handler, HTMLHandler, LeafHandler } from "./handlers";
import { IncomingMessage, ServerResponse, createServer } from "http";
import * as path from "path";

import { Crawler } from "./crawler";
import { Request } from "./request";

const port: number = process.env.PORT || 8080;

const crawledHandler = new Crawler().crawl("server/data", { namedHandlers: { document: handlers.document } });

const errorHandler = new ErrorHandler(crawledHandler, (error: Error) => Handler.handleError(error.request, error.errorCode));

const server = createServer(function requestListener(request: IncomingMessage, response: ServerResponse) {
  errorHandler.handleRequest(new Request(request, response));
});

server.on("listening", function serverListen() {
  console.log("Server listening on %d", port);
});

server.listen(port);
