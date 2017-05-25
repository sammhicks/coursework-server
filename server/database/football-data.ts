import * as requestPromise from "request-promise-native";

import { Throttle } from "../../promises/throttle";

import { Teams, Players } from "./football-data-types";

const apiKey = "31a3eb348dce4d8fa6b62ab42e898f59"

export class FootballData {
    private _throttle: Throttle;

    constructor() {
        this._throttle = new Throttle(1500);
    }

    private request<OutType>(...resource: string[]): Promise<OutType> {
        return this._throttle.access().then(() => requestPromise({
            uri: "https://api.football-data.org/v1/" + resource.join("/"),
            headers: {
                "User-Agent": "Ball To Hand Crawler",
                "X-Auth-Token": "31a3eb348dce4d8fa6b62ab42e898f59"
            },
            json: true
        }));
    }

    getTeams(competitionID: number) {
        return this.request<Teams>("competitions", competitionID.toString(10), "teams");
    }

    getPlayers(teamID: number) {
        return this.request<Players>("teams" + teamID.toString(10) + "players")
    }
}
