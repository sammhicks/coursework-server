import * as httpStatus from "http-status-codes";

import { Handler, LeafHandler } from "../../../handlers";
import { Request } from "../../../request";

import { Interface as DatabaseInterface } from "../database";

export class AllVideosHandler extends LeafHandler {
    constructor(database: DatabaseInterface) {
        super(new AllVideosHandlerInner(database));
    }
}

class AllVideosHandlerInner extends Handler {
    constructor(private database: DatabaseInterface) {
        super();
    }

    handleRequest(request: Request): Promise<void> {
        request.response.setHeader("Cache-Control", "no-store");
        return this.database.allVideos().then(Handler.handleJSONCurry(request));
    }
}
