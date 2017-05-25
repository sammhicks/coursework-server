import { Link, getResourceID } from "./link";

export interface Teams {
    teams: Team[];
}

export interface Team {
    _links: {
        self: Link
    };
    name: string;
    code: string;
    shortName: string;
    crestUrl: string;
}

export function getID(team: Team) {
    return getResourceID(team._links.self);
}
