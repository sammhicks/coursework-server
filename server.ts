"use strict";

import { IncomingMessage, ServerResponse, createServer } from "http";
import { Crawler } from "./crawler";
import { DirectoryHandler, DomainHandler, Error, ErrorHandler, FileHandler, Handler, LeafHandler, RootDomainHandler } from "./handlers";
import { Request } from "./request";

const port: number = process.env.PORT || 8080;

const crawledHandler: DomainHandler = Crawler.crawl("server");

const errorHandler = new ErrorHandler(crawledHandler, (error: Error) => Handler.handleError(error.request, error.errorCode));

const server = createServer(function requestListener(request: IncomingMessage, response: ServerResponse) {
  errorHandler.handleRequest(new Request(request, response));
});

server.on("listening", function serverListen(): void {
  console.log("Server listening on %d", port);
});

server.listen(port);
