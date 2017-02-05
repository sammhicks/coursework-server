import { Error } from "./error";
import { Handler } from "./handler";
import * as httpStatus from "http-status-codes";
import { Request } from "../request";

export class DirectoryHandler extends Handler {
  constructor(public contents: { [DirectoryItem: string]: Handler }) {
    super();
  }

  handleRequest(request: Request): Promise<void> {
    if (request.path.length === 0) {
      return Promise.reject(new Error(request, httpStatus.NOT_FOUND));
    } else {
      const directoryItem = request.path.shift();

      if (directoryItem in this.contents) {
        return this.contents[directoryItem].handleRequest(request);
      } else {
        return Promise.reject(new Error(request, httpStatus.NOT_FOUND));
      }
    }
  }
}
