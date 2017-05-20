import { ETagHandler } from "./etag";
import * as fs from "fs";
import { Handler } from "./handler";
import * as httpStatus from "http-status-codes";
import * as path from "path";
import { Request } from "../request";

export const mimeTypes: { [extension: string]: string } = {
  ".css": "text/css",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".js": "application/javascript",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".xml": "application/xml"
};

export class FileHandler extends Handler {
  eTagHandler: ETagHandler;

  length: number;

  updateInfo() {
    this.eTagHandler = new ETagHandler(fs.readFileSync(this.serverPath));

    const stats = fs.statSync(this.serverPath);
    this.length = stats.size;
  }

  constructor(private serverPath: string) {
    super();

    fs.watch(serverPath, {}, () => this.updateInfo());

    this.updateInfo();
  }

  handleRequest(request: Request): Promise<void> {
    const self = this;
    return new Promise<void>(function executor(resolve, reject) {
      if (self.eTagHandler.tryHandle(request)) {
        resolve();
      } else {
        request.response.setHeader("Content-Type", mimeTypes[path.extname(self.serverPath)]);
        request.response.setHeader("Content-Length", self.length.toString(10));
        request.response.setHeader("Cache-Control", "public, must-revalidate");

        const status = httpStatus.OK;
        request.response.writeHead(status, httpStatus.getStatusText(status));

        request.response.on("finish", resolve);

        fs.createReadStream(self.serverPath).pipe(request.response);
      }
    });
  }
}
