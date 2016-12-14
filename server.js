"use strict";

const http = require("http");
const promiseLoop = require("./promise-loops");
const sqlite = require("./sqlite3-promise");

sqlite.open(":memory:")
  .then(function (database) {
    console.log("Opened Database");
    return database.run("CREATE TABLE lorem (info TEXT)")
      .then(() => database.prepare("INSERT INTO lorem VALUES (?)"))
      .then((statement) => promiseLoop.for(() => 0, i => i < 30, i => i + 1, i => statement.run("Imsum " + i)))
      .then(function () {
        const port = process.env.PORT || 8080;

        var server = http.createServer(function requestListener(request, response) {
          response.setHeader("Content-Type", "text/plain");

          response.writeHead(200);

          database.all("SELECT rowid AS id, info FROM lorem")
            .then(results => response.end(results.map(result => [result.id, result.info]).join("\n")));
        }).listen(port);
      })
  })
  .catch(console.error);
