import * as crypto from "crypto";
import * as httpStatus from "http-status-codes";
import { Request } from "../request";
import * as zlib from "zlib";

export class ETagHandler {
    eTag: string;

    constructor(data: Buffer) {
        const hash = crypto.createHash("md5");

        hash.update(data);
        this.eTag = hash.digest("hex");
    }

    tryHandle(request: Request): boolean {
        if ("if-none-match" in request.request.headers && request.request.headers["if-none-match"] == this.eTag) {
            request.response.setHeader("ETag", this.eTag);
            request.response.writeHead(httpStatus.NOT_MODIFIED);
            request.response.end();

            return true;
        } else {
            request.response.setHeader("ETag", this.eTag);

            return false;
        }
    }
}
