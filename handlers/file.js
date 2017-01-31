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
  }

  handleRequest(request) {
    request.response.setHeader("Content-Type", mimeTypes[path.extname(this.serverPath)]);
    request.response.setHeader("Content-Length", fs.statSync(this.serverPath).size);

    request.response.writeHead(HttpStatus.OK);

    request.response.end(fs.readFileSync(this.serverPath));

    return Promise.resolve();
  }
}

exports.File = File;
exports.mimeTypes = mimeTypes;
