"use strict";

const Enum = require("enum");
const sqlite3 = require("sqlite3");

function handleErr(resolve, reject) {
  const constResult = Array.prototype.splice.call(arguments, 2);

  const returnThis = constResult.length === 0;

  return function (err, result) {
    if (err !== null) {
      reject(err);
    } else if (result !== undefined) {
      resolve(result);
    } else if (returnThis) {
      resolve(this);
    } else {
      resolve(constResult);
    }
  };
}


exports.mode = new Enum({
  readonly: "sqlite3.OPEN_READONLY",
  readwrite: "sqlite3.OPEN_READWRITE",
  create: "sqlite3.OPEN_CREATE"
});

exports.Database = function () {
  var self = this;

  this.database = null;

  // Open a database
  this.open = function () {
    const args = arguments;

    return new Promise(function (resolve, reject) {
      self.database = new sqlite3.Database(...[...args, handleErr(resolve, reject)]);
    });
  }

  // Close a database
  this.close = () => new Promise(function (resolve, reject) {
    if (self.database !== null) {
      self.database.close(handleErr(resolve, reject));
    } else {
      reject();
    }
  });

  // Run a query
  this.run = function () {
    const args = arguments;

    return new Promise(function (resolve, reject) {
      if (self.database !== null) {
        self.database.run(...[...args, handleErr(resolve, reject)]);
      } else {
        reject();
      }
    });
  }

  // Run a query and get a single result
  this.get = function () {
    const args = arguments;

    return new Promise(function (resolve, reject) {
      if (self.database !== null) {
        self.database.get(...[...args, handleErr(resolve, reject)]);
      } else {
        reject();
      }
    });
  }

  // Run a query and get all results
  this.all = function () {
    const args = arguments;

    return new Promise(function (resolve, reject) {
      if (self.database !== null) {
        self.database.all(...[...args, handleErr(resolve, reject)]);
      } else {
        reject();
      }
    });
  }
}
