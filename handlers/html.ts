import * as crypto from "crypto";
import { Document } from "../html"
import { Handler } from "./handler";
import * as httpStatus from "http-status-codes";
import { Request } from "../request";

export class HTMLHandler extends Handler {
    private document: string;
    private documentLength: string;
    private eTag: string;

    constructor(document: Document) {
        super();
        this.document = document.Render();
        this.documentLength = this.document.length.toString(10);

        const hash = crypto.createHash("md5");

        hash.update(this.document);
        this.eTag = hash.digest("hex");
    }

    handleRequest(request: Request): Promise<void> {
        if ("if-none-match" in request.request.headers && request.request.headers["if-none-match"] == this.eTag) {
            request.response.writeHead(httpStatus.NOT_MODIFIED);
            request.response.end();

            return Promise.resolve();
        } else {
            if ("accept" in request.request.headers && request.request.headers["accept"].includes("application/xhtml+xml")) {
                request.response.setHeader("Content-Type", "application/xhtml+xml");
            } else {
                request.response.setHeader("Content-Type", "text/html");
            }
            request.response.setHeader("Content-Length", this.documentLength);
            request.response.setHeader("ETag", this.eTag);
            request.response.end(this.document);

            return Promise.resolve();
        }
    }
}
