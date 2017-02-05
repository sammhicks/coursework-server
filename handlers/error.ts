import { Handler } from "./handler";
import { Request } from "../request";

export class Error {
  constructor(public request: Request, public errorCode: number) { };
}

export class ErrorHandler extends Handler {
  constructor(public handler: Handler, public catcher: (Error) => Promise<void>) {
    super();
  }

  handleRequest(request: Request): Promise<void> {
    return this.handler.handleRequest(request).catch(this.catcher);
  }
}
