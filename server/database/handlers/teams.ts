import * as httpStatus from "http-status-codes";

import { Handler, LeafHandler, HandlerError } from "../../../handlers";
import { Request } from "../../../request";

import { Interface as DatabaseInterface } from "../database";

import { parseIndices } from "./indices";

export class TeamsHandler extends Handler {
    constructor(private database: DatabaseInterface) {
        super();
    }

    handleRequest(request: Request): Promise<void> {
        if (request.path.length === 0) {
            request.response.setHeader("Cache-Control", "no-store");
            return this.database.getAllTeams().then(Handler.handleJSONCurry(request));
        } else if (request.path.length === 2) {
            var errorFound = false;
            const teams = parseIndices(request.path.shift());
            const resource = request.path.shift();

            if (teams == null) {
                return Promise.reject(new HandlerError(httpStatus.BAD_REQUEST));
            } else {
                const self = this;
                const handleJSON = Handler.handleJSONCurry(request);

                const playersPromise = this.database.getPlayers(teams);

                if (resource == "players") {
                    return playersPromise.then(handleJSON);
                } else {
                    return Promise.reject(new HandlerError(httpStatus.NOT_FOUND));
                }
            }
        } else {
            return Promise.reject(new HandlerError(httpStatus.NOT_FOUND));
        }
    }
}
