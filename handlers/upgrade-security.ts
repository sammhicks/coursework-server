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

    request.response.setHeader("Content-Length", "0");
    request.response.setHeader("Location", url.format(redirectUrl));

    const status = httpStatus.MOVED_TEMPORARILY;
    request.response.writeHead(status, httpStatus.getStatusText(status));
    request.response.end();

    return Promise.resolve();
}
