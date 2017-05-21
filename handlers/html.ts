import { Document } from "../html"
import { ETagHandler } from "./etag"
import { Handler } from "./handler";
import * as httpStatus from "http-status-codes";
import { Request } from "../request";
import * as zlib from "zlib";
import { BufferReader } from "./bufferreader";

export class HTMLHandler extends Handler {
    private document: Buffer;
    private gzipDocument: Buffer;
    private eTagHandler: ETagHandler;

    constructor(document: Document) {
        super();
        this.document = Buffer.from(document.Render(), "utf-8");
        this.gzipDocument = zlib.gzipSync(this.document, { level: zlib.Z_BEST_COMPRESSION });
        this.eTagHandler = new ETagHandler(this.document);
    }

    handleRequest(request: Request): Promise<void> {
        const self = this;
        return new Promise<void>(function executor(resolve, reject) {
            if (self.eTagHandler.tryHandle(request)) {
                resolve();
            } else {
                if ("accept" in request.request.headers && request.request.headers["accept"].includes("application/xhtml+xml")) {
                    request.response.setHeader("Content-Type", "application/xhtml+xml");
                } else {
                    request.response.setHeader("Content-Type", "text/html");
                }

                let bodyBuffer: Buffer;

                if ("accept-encoding" in request.request.headers && request.request.headers["accept-encoding"].indexOf("gzip") > -1) {
                    request.response.setHeader("Content-Encoding", "gzip");

                    bodyBuffer = self.gzipDocument;
                } else {
                    bodyBuffer = self.document;
                }

                request.response.setHeader("Content-Length", bodyBuffer.length.toString(10));

                request.response.on("finish", resolve);

                new BufferReader(bodyBuffer).pipe(request.response);
            }
        });
    }
}
