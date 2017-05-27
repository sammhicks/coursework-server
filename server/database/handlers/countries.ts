import * as httpStatus from "http-status-codes";

import { Handler, LeafHandler, HandlerError } from "../../../handlers";
import { Request } from "../../../request";

import { Interface as DatabaseInterface } from "../database";

import { parseIndices } from "./indices";

import { getSorting } from "./sorting";

export class CountriesHandler extends Handler {
    constructor(private database: DatabaseInterface) {
        super();
    }

    handleRequest(request: Request): Promise<void> {
        if (request.path.length === 0) {
            request.response.setHeader("Cache-Control", "no-store");
            return this.database.getAllCountries().then(Handler.handleJSONCurry(request));
        } else if (request.path.length === 2) {
            var errorFound = false;
            const countries = parseIndices(request.path.shift());
            const resource = request.path.shift();

            if (countries == null) {
                return Promise.reject(new HandlerError(httpStatus.BAD_REQUEST));
            } else {
                const self = this;
                const handleJSON = Handler.handleJSONCurry(request);

                if (resource == "videos") {
                    return self.database.getVideosFromCountries(countries, getSorting(request)).then(handleJSON);
                } else {
                    const competitionsPromise = this.database.getCompetitions(countries);

                    if (resource == "competitions") {
                        return competitionsPromise.then(handleJSON);
                    } else {
                        const teamsPromise = competitionsPromise.then(competitions => self.database.getTeams(competitions.map(competition => competition.id)));

                        if (resource == "teams") {
                            return teamsPromise.then(handleJSON);
                        } else if (resource == "players") {
                            return teamsPromise
                                .then(teams => self.database.getPlayers(teams.map(team => team.id)))
                                .then(handleJSON);
                        } else {
                            return Promise.reject(new HandlerError(httpStatus.NOT_FOUND));
                        }
                    }
                }
            }
        } else {
            return Promise.reject(new HandlerError(httpStatus.NOT_FOUND));
        }
    }
}
