import * as httpStatus from "http-status-codes";

import { Handler, LeafHandler } from "../../../handlers";
import { Request } from "../../../request";

import { Fetcher } from "../database";

export class AllVideosHandler extends LeafHandler {
    constructor(database: Fetcher) {
        super(new AllVideosHandlerInner(database));
    }
}

class AllVideosHandlerInner extends Handler {
    constructor(private database: Fetcher) {
        super();
    }

    handleRequest(request: Request): Promise<void> {
        return this.database.allVideos().then(Handler.handleJSONCurry(request));
    }
}
