import * as httpStatus from "http-status-codes";
import * as os from "os";
import { Request } from "../request";

export abstract class Handler {
  abstract handleRequest(request: Request): Promise<void>;

  static handleError(request: Request, errorCode: number = httpStatus.INTERNAL_SERVER_ERROR) {
    request.response.setHeader("Content-Type", "text/plain");

    request.response.writeHead(errorCode);

    request.response.end(httpStatus.getStatusText(errorCode) + os.EOL);

    return Promise.resolve();
  }
}
