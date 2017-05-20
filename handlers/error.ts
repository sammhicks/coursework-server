import * as httpStatus from "http-status-codes";

import { Handler } from "./handler";
import { Request } from "../request";

export class HandlerError extends Error {
  constructor(public errorCode: number) {
    super(httpStatus.getStatusText(errorCode));
  };
}

export class ErrorHandler extends Handler {
  constructor(private handler: Handler, private catcher: (request: Request, error: HandlerError) => Promise<void>) {
    super();
  }

  handleRequest(request: Request): Promise<void> {
    const self = this;
    return this.handler.handleRequest(request).catch(function catchError(error: HandlerError) {
      return self.catcher(request, error);
    });
  }
}
