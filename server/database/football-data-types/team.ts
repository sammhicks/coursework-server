export interface Teams {
    team: Team[];
}

export interface Team {
    _links: {
        players: {
            href: string
        },
    },
    name: string,
    code: string,
    shortName: string,
    crestUrl: string
}
