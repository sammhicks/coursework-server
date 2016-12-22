"use strict";

const promiseLoop = require("./promise-loops");
const sqlite = require("./sqlite3-promise");

class DatabaseHandler {
  constructor() {
    this.openDatabase = sqlite.open(":memory:")
      .then(function (database) {
        console.log("Opened Database");
        return database.run("CREATE TABLE lorem (info TEXT)")
          .then(() => database.prepare("INSERT INTO lorem VALUES (?)"))
          .then((statement) => promiseLoop.for(() => 0, i => i < 30, i => i + 1, i => statement.run("Imsum " + i)).then(() => statement.finalize())).
          then(() => database);
      });
  }

  handleRequest(request) {
    request.response.setHeader("Content-Type", "text/plain");

    request.response.writeHead(200);

    this.openDatabase.then(database => database.all("SELECT rowid AS id, info FROM lorem")
      .then(results => request.response.end(results.map(result => [result.id, result.info]).join("\n"))));
  }
}

exports.DatabaseHandler = DatabaseHandler;
