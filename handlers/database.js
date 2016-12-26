"use strict";

const Handler = require("./handler").Handler;
const HttpStatus = require("http-status-codes");
const promiseLoop = require("../promise-loops");
const sqlite = require("../sqlite3-promise");

class DatabaseHandler extends Handler {
  constructor() {
    super();

    this.openDatabase = sqlite.open(":memory:")
      .then(function (database) {
        console.log("Opened Database");
        return database.run("CREATE TABLE lorem (info TEXT)")
          .then(() => database.prepare("INSERT INTO lorem VALUES (?)"))
          .then((statement) => promiseLoop.for(() => 0, i => i < 30, i => i + 1, i => statement.run("Imsum " + i)).then(() => statement.finalize())).
          then(() => database);
      }).catch(function (err) {
        console.error("Failed to initialise database:", err);
      });
  }

  handleRequest(request) {
    return this.openDatabase.then(function (database) {
      return database.all("SELECT rowid AS id, info FROM lorem")
        .then(function (results) {
          request.response.setHeader("Content-Type", "text/plain");

          request.response.writeHead(200);

          request.response.end(results.map(result => [result.id, result.info]).join("\n"));

          return Promise.resolve();
        });
    }).catch(function () {
      request.errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
      return Promise.reject(request);
    });
  }
}

exports.DatabaseHandler = DatabaseHandler;
