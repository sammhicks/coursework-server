import * as httpStatus from "http-status-codes";
import * as os from "os";
import { Request } from "../request";
import { HandlerError } from "./error";
import * as stream from "stream";
import { BufferReader } from "./bufferreader";

export abstract class Handler {
  abstract handleRequest(request: Request): Promise<void>;

  static handleError(request: Request, error: HandlerError) {
    if (error.errorCode == undefined) {
      error.errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    }

    request.response.setHeader("Content-Type", "text/plain; charset=UTF-8");

    request.response.writeHead(error.errorCode, httpStatus.getStatusText(error.errorCode));

    request.response.end(httpStatus.getStatusText(error.errorCode) + os.EOL);

    return Promise.resolve();
  }

  static handleString(request: Request, status: number, mimeType: string, body: string): Promise<void> {
    return new Promise<void>(function executor(resolve, reject) {
      const bodyBuffer = Buffer.from(body, "utf-8");

      request.response.setHeader("Content-Type", mimeType);
      request.response.setHeader("Content-Length", bodyBuffer.length.toString(10));

      request.response.writeHead(status, httpStatus.getStatusText(status));

      request.response.on("finish", resolve);

      new BufferReader(bodyBuffer).pipe(request.response);
    });
  }

  static handleJSON(request: Request, object?: any): Promise<void> {
    return Handler.handleString(request, httpStatus.OK, "application/json; charset=UTF-8", JSON.stringify(object));
  }

  static handleJSONCurry(request: Request): (object: any) => Promise<void> {
    return function handleJSONCurried(object: any) {
      return Handler.handleJSON(request, object);
    }
  }
}
