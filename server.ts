"use strict";

import { handlers } from "./server/html-handlers";
import { HandlerError, ErrorHandler, Handler, HTMLHandler, LeafHandler, PromisedHandler, UpgradeInsecure } from "./handlers";
import * as fs from "fs"
import { IncomingMessage, ServerResponse, createServer as createHttpServer } from "http";
import { createServer as createHttpsServer, ServerOptions as HttpsServerOptions } from "https";
import * as path from "path";

import { Crawler } from "./crawler";
import { Request } from "./request";

import { Locked } from "./promises/lock";
import { Database, Mode as DatabaseMode } from "./promises/sqlite3";
import { crawl as crawlFootballData } from "./server/database/football-data-crawler";
import { crawl as crawlReddit } from "./server/database/reddit-crawler";
import { Interface as DatabaseInterface } from "./server/database/database";
import { APIHandler } from "./server/database/handlers";

const insecurePort: number = process.env.PORT || 8080;
const securePort: number = process.env.SECUREPORT || 443;

const databasePromise = new Database().open("server/database/database.sqlite3", DatabaseMode.readwrite).then(function handleDatabaseOpen(database: Database) {
  console.log("Database open");
  return database;
}, function handleDatabaseError(error: Error) {
  console.error("Failed to open database: ", error);
  throw error;
});

const databaseInterfacePromise = databasePromise.then(database => new DatabaseInterface(new Locked(database)));

const apiHandler = new PromisedHandler(databaseInterfacePromise.then(database => new APIHandler(database)));

const crawledHandler = new Crawler().crawl("server/data", {
  namedHandlers: {
    home: handlers.home,
    about: handlers.about,
    api: apiHandler
  }
});

const upgradeInsecureHandler = new UpgradeInsecure(crawledHandler, securePort);

const errorHandler = new ErrorHandler(upgradeInsecureHandler, Handler.handleError);

const insecureServer = createHttpServer(function requestListener(request: IncomingMessage, response: ServerResponse) {
  errorHandler.handleRequest(new Request(request, response, false));
});

insecureServer.on("listening", function serverListen() {
  console.log("HTTP server listening on %d", insecurePort);
});

insecureServer.listen(insecurePort);

const certs = fs.readFileSync("keys/server.pfx");

const secureServer = createHttpsServer({ pfx: certs }, function requestListener(request: IncomingMessage, response: ServerResponse) {
  errorHandler.handleRequest(new Request(request, response, true));
});

secureServer.on("listening", function serverListen() {
  console.log("HTTPS server listening on %d", securePort);
});

secureServer.listen(securePort);

//databaseInterfacePromise.then(database => crawlFootballData(database).then(() => database)).then(crawlReddit);
