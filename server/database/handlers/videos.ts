import * as httpStatus from "http-status-codes";

import { Handler, LeafHandler, HandlerError } from "../../../handlers";
import { Request } from "../../../request";

import { Interface } from "../database";
import { Video } from "../database-types";

import { parseIndices } from "./indices";

import { getSorting } from "./sorting";

export class VideosHandler extends Handler {
    constructor(private database: Interface) {
        super();
    }

    handleRequest(request: Request): Promise<void> {
        const self = this;
        if (request.path.length === 0) {
            request.response.setHeader("Cache-Control", "no-store");
            return self.database.getAllVideos(getSorting(request))
                .then(Handler.handleJSONCurry(request));
        } else {
            return Promise.reject(new HandlerError(httpStatus.NOT_FOUND));
        }
    }
}
