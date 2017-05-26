"use strict";

import { handlers } from "./server/html-handlers";
import { Error, ErrorHandler, Handler, HTMLHandler, LeafHandler, UpgradeInsecure } from "./handlers";
import * as fs from "fs"
import { IncomingMessage, ServerResponse, createServer as createHttpServer } from "http";
import { createServer as createHttpsServer, ServerOptions as HttpsServerOptions } from "https";
import * as path from "path";

import { Crawler } from "./crawler";
import { Request } from "./request";

const insecurePort: number = process.env.PORT || 8080;
const securePort: number = process.env.SECUREPORT || 443;

const crawledHandler = new Crawler().crawl("server/data", { namedHandlers: { home: handlers.home, about: handlers.about } });

const upgradeInsecureHandler = new UpgradeInsecure(crawledHandler, securePort);

const errorHandler = new ErrorHandler(upgradeInsecureHandler, (error: Error) => Handler.handleError(error.request, error.errorCode));

const insecureServer = createHttpServer(function requestListener(request: IncomingMessage, response: ServerResponse) {
  errorHandler.handleRequest(new Request(request, response, false));
});

insecureServer.on("listening", function serverListen() {
  console.log("HTTP server listening on %d", insecurePort);
});

insecureServer.listen(insecurePort);

/* generated using
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
openssl pkcs12 -inkey key.pem -in cert.pem -export -out pfx.pfx
*/

const certs = fs.readFileSync('keys/pfx.pfx');

const secureServer = createHttpsServer({ pfx: certs }, function requestListener(request: IncomingMessage, response: ServerResponse) {
  errorHandler.handleRequest(new Request(request, response, true));
});

secureServer.on("listening", function serverListen() {
  console.log("HTTPS server listening on %d", securePort);
});

secureServer.listen(securePort);
