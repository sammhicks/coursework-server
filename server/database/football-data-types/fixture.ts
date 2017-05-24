export interface Fixtures {
    fixtures: Fixture[];
}

export interface Fixture {
    date: string,
    status: string;
    matchday: number,
    homeTeamName: string,
    awayTeamName: string,
}
