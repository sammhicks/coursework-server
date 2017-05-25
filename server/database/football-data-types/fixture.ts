import { Link, getResourceID } from "./link";

export interface Fixtures {
    fixtures: Fixture[];
}

export interface Fixture {
    _links: {
        homeTeam: Link,
        awayTeam: Link
    };
    date: string;
}

export function getHomeTeamID(fixture: Fixture) {
    return getResourceID(fixture._links.homeTeam);
}

export function getAwayTeamID(fixture: Fixture) {
    return getResourceID(fixture._links.awayTeam);
}
