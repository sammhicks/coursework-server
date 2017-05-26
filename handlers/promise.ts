import { Handler } from "./handler"
import { Request } from "../request";

export class PromisedHandler extends Handler {
    constructor(private promise: Promise<Handler>) {
        super();
    }

    handleRequest(request: Request): Promise<void> {
        return this.promise.then(handler => handler.handleRequest(request));
    }
}
