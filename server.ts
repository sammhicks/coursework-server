"use strict";

import { IncomingMessage, ServerResponse, createServer } from "http";

import { Crawler } from "./crawler";
import { Error, ErrorHandler, Handler, HTMLHandler, LeafHandler } from "./handlers";
import { Document, Element, String } from "./html";
import { Request } from "./request";

const port: number = process.env.PORT || 8080;

const documentHandler = new LeafHandler(new HTMLHandler(new Document("en-GB", "My Document", {}, ["index.css"], ["index.js"], new Element(
  "body", {}, [
    new Element("h1", {}, [
      new String("Hello World")
    ])
  ]
))))

const crawledHandler = new Crawler().crawl("server", { namedHandlers: { document: documentHandler } });

const errorHandler = new ErrorHandler(crawledHandler, (error: Error) => Handler.handleError(error.request, error.errorCode));

const server = createServer(function requestListener(request: IncomingMessage, response: ServerResponse) {
  errorHandler.handleRequest(new Request(request, response));
});

server.on("listening", function serverListen() {
  console.log("Server listening on %d", port);
});

server.listen(port);
