import { Error } from "./error";
import { Handler } from "./handler";
import * as httpStatus from "http-status-codes";
import { Request } from "../request";

export class DomainHandler extends Handler {
  constructor(public domains: { [Domain: string]: Handler }) {
    super();
  }

  handleRequest(request: Request): Promise<void> {
    if (request.domain.length === 0) {
      if ("" in this.domains) {
        return this.domains[""].handleRequest(request);
      } else {
        return Promise.reject(new Error(request, httpStatus.NOT_FOUND));
      }
    } else {
      const domain = request.domain.pop();

      if (domain in this.domains) {
        return this.domains[domain].handleRequest(request);
      } else {
        return Promise.reject(new Error(request, httpStatus.NOT_FOUND));
      }
    }
  }
}
