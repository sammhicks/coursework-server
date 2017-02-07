import { Document } from "../html"
import { Handler } from "./handler";
import { Request } from "../request";

export class HTMLHandler extends Handler {
    private document: string;

    constructor(document: Document) {
        super();
        this.document = document.Render();
    }

    handleRequest(request: Request): Promise<void> {
        if ("accept" in request.request.headers && request.request.headers["accept"].includes("application/xhtml+xml")) {
            request.response.setHeader("Content-Type", "application/xhtml+xml");
        } else {
            request.response.setHeader("Content-Type", "text/html");
        }
        request.response.setHeader("Content-Length", this.document.length.toString(10));
        request.response.end(this.document);

        return Promise.resolve();
    }
}