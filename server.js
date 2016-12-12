"use strict";

const http = require('http');

const port = process.env.PORT || 8080;

http.createServer(function requestListener(request, response) {
  response.setHeader('Content-Type', 'text/plain');

  response.writeHead(200);

  response.end('Hello World!');
}).listen(port);
