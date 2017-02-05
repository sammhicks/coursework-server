import { Error } from "./error";
import { Handler } from "./handler";
import * as httpStatus from "http-status-codes";
import { Request } from "../request";

export class RootDomainHandler extends Handler {
  constructor(public handler: Handler) {
    super();
  }

  handleRequest(request: Request): Promise<void> {
    if (request.domain.length === 0) {
      return this.handler.handleRequest(request);
    } else {
      return Promise.reject(new Error(request, httpStatus.NOT_FOUND));
    }
  }
}
