import * as httpStatus from "http-status-codes";
import { Request } from "../request";
import * as url from "url"

export function upgradeSecurity(request: Request, securePort: number): Promise<void> {
    let redirectUrl: url.Url = {
        protocol: "https:",
        auth: request.requestURL.auth,
        hostname: request.requestURL.hostname,
        port: String(securePort),
        path: request.requestURL.path,
        hash: request.requestURL.hash
    }

    request.response.writeHead(httpStatus.MOVED_TEMPORARILY, {
        "Content-Length": "0",
        "Location": url.format(redirectUrl)
    });
    request.response.end();

    return Promise.resolve();
}
