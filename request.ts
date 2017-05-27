import * as http from "http";
import * as url from "url";

export class Request {
  path: string[];
  query: { [term: string]: string };
  requestURL: url.Url

  constructor(public request: http.IncomingMessage, public response: http.ServerResponse, public isSecure: boolean) {
    let protocol = isSecure ? "https://" : "http://";
    let host = request.headers["host"];

    this.requestURL = url.parse(protocol + host + request.url, true);

    this.path = this.requestURL.pathname === undefined ? [] : this.requestURL.pathname.split("/").slice(1);
    this.query = this.requestURL.query;
  }
}
