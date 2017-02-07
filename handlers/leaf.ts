import { Error } from "./error";
import { Handler } from "./handler";
import * as httpStatus from "http-status-codes";
import { Request } from "../request";

export class LeafHandler extends Handler {
  constructor(private handler: Handler) {
    super();
  }

  handleRequest(request: Request): Promise<void> {
    if (request.path.length === 0 || (request.path.length === 1 && request.path[0] === "")) {
      return this.handler.handleRequest(request);
    } else {
      return Promise.reject(new Error(request, httpStatus.NOT_FOUND));
    }
  }
}
