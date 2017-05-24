import * as requestPromise from "request-promise-native";

import { Throttle } from "../../promises/throttle";

import { Fixture } from "./football-data-types";

const apiKey = "31a3eb348dce4d8fa6b62ab42e898f59"

const timeRange = 10 * 24 * 60 * 60 * 1000;

export class FootballData {
    private _throttle: Throttle;

    constructor() {
        this._throttle = new Throttle(1500);
    }

    private request(resource: string) {
        return requestPromise({
            uri: "https://api.football-data.org/v1/" + resource,
            headers: {
                "X-Auth-Token": "31a3eb348dce4d8fa6b62ab42e898f59"
            },
            json: true
        });
    }

    lookupFixture(date: Date) {
        const startDate = new Date(new Date().getTime() - timeRange).toISOString().substring(0, 10);
        const endDate = new Date(new Date().getTime() + timeRange).toISOString().substring(0, 10);

        return this.request("fixtures?")

    })
}
}
