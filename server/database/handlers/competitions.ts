import * as httpStatus from "http-status-codes";

import { Handler, LeafHandler, HandlerError } from "../../../handlers";
import { Request } from "../../../request";

import { Interface as DatabaseInterface } from "../database";

import { parseIndices } from "./indices";

export class CompetitionsHandler extends Handler {
    constructor(private database: DatabaseInterface) {
        super();
    }

    handleRequest(request: Request): Promise<void> {
        if (request.path.length === 0) {
            request.response.setHeader("Cache-Control", "no-store");
            return this.database.getAllCountries().then(Handler.handleJSONCurry(request));
        } else if (request.path.length === 2) {
            var errorFound = false;
            const competitions = parseIndices(request.path.shift());
            const resource = request.path.shift();

            if (competitions == null) {
                return Promise.reject(new HandlerError(httpStatus.BAD_REQUEST));
            } else {
                const self = this;
                const handleJSON = Handler.handleJSONCurry(request);

                const teamsPromise = this.database.getTeams(competitions);

                if (resource == "teams") {
                    return teamsPromise.then(handleJSON);
                } else {
                    const playersPromise = teamsPromise.then(teams => self.database.getPlayers(teams.map(team => team.id)));

                    if (resource == "players") {
                        return playersPromise.then(handleJSON);
                    } else {
                        return Promise.reject(new HandlerError(httpStatus.NOT_FOUND));
                    }
                }
            }
        } else {
            return Promise.reject(new HandlerError(httpStatus.NOT_FOUND));
        }
    }
}
