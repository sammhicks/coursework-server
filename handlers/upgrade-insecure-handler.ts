import { Handler } from "./handler";
import * as httpStatus from "http-status-codes";
import { Request } from "../request";
import * as url from "url"
import { upgradeSecurity } from "./upgrade-security"

export class UpgradeInsecure extends Handler {
    constructor(private handler: Handler, private securePort: number) {
        super();
    }

    handleRequest(request: Request): Promise<void> {
        if (request.isSecure || request.request.headers["upgrade-insecure-requests"] != "1") {
            return this.handler.handleRequest(request);
        } else {
            return upgradeSecurity(request, this.securePort);
        }
    }
}
