"use strict";

const Enum = require("enum");
const sqlite3 = require("sqlite3");

function handleErr(resolve, reject) {
  return function (err, result) {
    if (err === undefined) {
      resolve();
    } else if (err !== null) {
      reject(err);
    } else if (result !== undefined) {
      resolve(result);
    } else {
      resolve(this);
    }
  };
}

function handleRequest(self, objectName, requestName) {
  return function () {
    const args = arguments;

    return (self[objectName] === null)
      ? Promise.reject()
      : new Promise((resolve, reject) => self[objectName][requestName](...[...args, handleErr(resolve, reject)]));
  }
}

function Statement(statement) {
  var self = this;

  this.statement = statement;

  var handleStatementRequest = requestName => handleRequest(self, "statement", requestName);

  this.bind = handleStatementRequest("bind");

  this.reset = handleStatementRequest("reset");

  this.finalize = handleStatementRequest("finalize");

  this.run = handleStatementRequest("run");

  this.get = handleStatementRequest("get");

  this.all = handleStatementRequest("all");
}

exports.mode = new Enum({
  readonly: "sqlite3.OPEN_READONLY",
  readwrite: "sqlite3.OPEN_READWRITE",
  create: "sqlite3.OPEN_CREATE"
});

function Database() {
  var self = this;

  this.database = null;

  // Open a database
  this.open = function () {
    const args = arguments;

    return new Promise(function (resolve, reject) {
      self.database = new sqlite3.Database(...[...args, handleErr(resolve, reject)]);
    }).then(() => self);
  }

  var handleDatabaseRequest = requestName => handleRequest(self, "database", requestName);

  // Close a database
  this.close = handleDatabaseRequest("close");

  // Run a query
  this.run = handleDatabaseRequest("run");

  // Run a query and get a single result
  this.get = handleDatabaseRequest("get");

  // Run a query and get all results
  this.all = handleDatabaseRequest("all");

  this.prepare = function () {
    const args = arguments;

    if (self.database === null) {
      return Promise.reject();
    } else {
      var statement = null;

      return new Promise(function (resolve, reject) {
        statement = self.database.prepare(...[...args, handleErr(resolve, reject)]);
      }).then(() => new Statement(statement));
    }
  }
}

exports.open = function () {
  var database = new Database();
  return database.open.apply(database, arguments)
}
