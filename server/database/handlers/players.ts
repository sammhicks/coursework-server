import * as httpStatus from "http-status-codes";

import { Handler, LeafHandler, HandlerError } from "../../../handlers";
import { Request } from "../../../request";

import { Interface as DatabaseInterface } from "../database";

import { parseIndices } from "./indices";

import { getSorting } from "./sorting";

import { attachTagsToVideosCurry } from "./videos";

export class PlayersHandler extends Handler {
    constructor(private database: DatabaseInterface) {
        super();
    }

    handleRequest(request: Request): Promise<void> {
        if (request.path.length === 0) {
            request.response.setHeader("Cache-Control", "no-store");
            return this.database.getAllPlayers().then(Handler.handleJSONCurry(request));
        } else if (request.path.length === 2) {
            var errorFound = false;
            const players = parseIndices(request.path.shift());
            const resource = request.path.shift();

            if (players == null) {
                return Promise.reject(new HandlerError(httpStatus.BAD_REQUEST));
            } else {
                const self = this;
                const handleJSON = Handler.handleJSONCurry(request);

                const videosPromise = this.database.getVideos(players, getSorting(request)).then(attachTagsToVideosCurry(self.database));

                if (resource == "videos") {
                    return videosPromise.then(handleJSON);
                } else {
                    return Promise.reject(new HandlerError(httpStatus.NOT_FOUND));
                }
            }
        } else {
            return Promise.reject(new HandlerError(httpStatus.NOT_FOUND));
        }
    }
}
