"use strict";

const fs = require("fs");
const Handler = require("./handler").Handler;
const HttpStatus = require("http-status-codes");
const path = require("path");

const mimeTypes = {
  ".txt": "text/plain"
};

class File extends Handler {
  constructor(serverPath) {
    super();

    this.serverPath = serverPath;

    const stats = fs.statSync(serverPath);

    this.mTime = new Date(stats.mtime);
    this.length = stats.size;
  }

  handleRequest(request) {
    if (request.request.headers["if-modified-since"] !== undefined && new Date(request.request.headers["if-modified-since"]) <= this.mTime) {
      request.response.writeHead(HttpStatus.NOT_MODIFIED);
      request.response.end();

      return Promise.resolve();
    } else {
      request.response.setHeader("Content-Type", mimeTypes[path.extname(this.serverPath)]);
      request.response.setHeader("Content-Length", this.length);
      request.response.setHeader("Last-Modified", this.mTime.toUTCString());
      request.response.setHeader("Cache-Control", "public, must-revalidate");

      request.response.writeHead(HttpStatus.OK);

      request.response.end(fs.readFileSync(this.serverPath));

      return Promise.resolve();
    }
  }
}

exports.File = File;
exports.mimeTypes = mimeTypes;
