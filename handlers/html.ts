import { Document } from "../html"
import { ETagHandler } from "./etag"
import { Handler } from "./handler";
import * as httpStatus from "http-status-codes";
import { Request } from "../request";
import * as zlib from "zlib";

export class HTMLHandler extends Handler {
    private document: Buffer;
    private documentLength: string;
    private gzipDocument: Buffer;
    private gzipDocumentLength: string;
    private eTagHandler: ETagHandler;

    constructor(document: Document) {
        super();
        this.document = Buffer.from(document.Render(), "utf-8");
        this.documentLength = this.document.length.toString(10);

        this.gzipDocument = zlib.gzipSync(this.document, { level: zlib.Z_BEST_COMPRESSION });
        this.gzipDocumentLength = this.gzipDocument.length.toString(10);

        this.eTagHandler = new ETagHandler(this.document);
    }

    handleRequest(request: Request): Promise<void> {
        if (this.eTagHandler.tryHandle(request)) {
            return Promise.resolve();
        } else {
            if ("accept" in request.request.headers && request.request.headers["accept"].includes("application/xhtml+xml")) {
                request.response.setHeader("Content-Type", "application/xhtml+xml");
            } else {
                request.response.setHeader("Content-Type", "text/html");
            }

            if ("accept-encoding" in request.request.headers && request.request.headers["accept-encoding"].indexOf("gzip") > -1) {
                request.response.setHeader("Content-Encoding", "gzip");
                request.response.setHeader("Content-Length", this.gzipDocumentLength);
                request.response.end(this.gzipDocument);
            } else {
                request.response.setHeader("Content-Length", this.documentLength);
                request.response.end(this.document);
            }

            return Promise.resolve();
        }
    }
}
