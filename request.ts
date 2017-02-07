import * as http from "http";
import * as url from "url";

export class Request {
  path: string[];
  query: string;

  constructor(public request: http.IncomingMessage, public response: http.ServerResponse) {
    let requestURL = url.parse(request.url, true);

    this.path = requestURL.path.split("/").slice(1);
    this.query = requestURL.query;
  }
}
