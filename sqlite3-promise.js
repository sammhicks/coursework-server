"use strict";

const Enum = require('enum');
const sqlite3 = require('sqlite3');

exports.mode = new Enum({
  readonly: 'sqlite3.OPEN_READONLY',
  readwrite: 'sqlite3.OPEN_READWRITE',
  create: 'sqlite3.OPEN_CREATE'
});

exports.Database = function () {
  var self = this;

  this.database = undefined;

  // Open a database
  this.open = function () {
    const args = [...arguments];

    return new Promise(function (resolve, reject) {
      function callback(err) {
        if (err === null) {
          resolve(self);
        } else {
          reject(err);
        }
      }

      args.push(callback);

      self.database = new sqlite3.Database(...args);
    });
  }

  // Close a database
  this.close = () => new Promise(function (resolve, reject) {
    if (self.database !== undefined) {
      self.database.close(function (err) {
        if (err === null) {
          resolve();
        } else {
          reject(err);
        }
      });
    } else {
      reject();
    }
  });

  // Run a query
  this.run = function () {
    const args = [...arguments];

    return new Promise(function (resolve, reject) {
      if (self.database !== undefined) {
        function callback(err) {
          if (err === null) {
            resolve(this.lastID, this.changes);
          } else {
            reject(err);
          }
        };

        args.push(callback);

        self.database.run(...args);
      } else {
        reject();
      }
    });
  }

  // Run a query and get a single result
  this.get = function () {
    const args = [...arguments];

    return new Promise(function (resolve, reject) {
      if (self.database !== undefined) {
        var callback = function (err, row) {
          if (err === null) {
            resolve(row);
          } else {
            reject(err);
          }
        };

        args.push(callback);

        self.database.get(...args);
      } else {
        reject();
      }
    });
  }

  // Run a query and get all results
  this.all = function () {
    const args = [...arguments];

    return new Promise(function (resolve, reject) {
      if (self.database !== undefined) {
        function callback(err, rows) {
          if (err === null) {
            resolve(rows);
          } else {
            reject(err);
          }
        };

        args.push(callback);

        self.database.all(...args);
      } else {
        reject();
      }
    });
  }
}
