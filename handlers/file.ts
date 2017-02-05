import { Error } from "./error";
import * as fs from "fs";
import { Handler } from "./handler";
import * as httpStatus from "http-status-codes";
import * as path from "path";
import { Request } from "../request";

export const mimeTypes: { [extension: string]: string } = {
  ".txt": "text/plain"
};

export class FileHandler extends Handler {
  mTime: Date;
  length: number;

  constructor(public serverPath: string) {
    super();

    const stats = fs.statSync(serverPath);

    this.mTime = new Date(stats.mtime);
    this.length = stats.size;
  }

  handleRequest(request: Request): Promise<void> {
    if (request.request.headers["if-modified-since"] !== undefined && new Date(request.request.headers["if-modified-since"]) <= this.mTime) {
      request.response.writeHead(httpStatus.NOT_MODIFIED);
      request.response.end();

      return Promise.resolve();
    } else {
      request.response.setHeader("Content-Type", mimeTypes[path.extname(this.serverPath)]);
      request.response.setHeader("Content-Length", this.length.toString(10));
      request.response.setHeader("Last-Modified", this.mTime.toUTCString());
      request.response.setHeader("Cache-Control", "public, must-revalidate");

      request.response.writeHead(httpStatus.OK);

      request.response.end(fs.readFileSync(this.serverPath));

      return Promise.resolve();
    }
  }
}
