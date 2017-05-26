import { Locked } from "../../promises/lock";
import { Database, Statement } from "../../promises/sqlite3";

import * as databaseTypes from "./database-types";
import { FootballData } from "./football-data";
import * as footballDataTypes from "./football-data-types";
import { Video as RedditVideo } from "./domains";

const statementStrings = {
    allCountries: "SELECT id, name FROM countries",
    allCompetitions: "SELECT id, name FROM competitions",
    allTeams: "SELECT id, name, short_name, crest_url from teams",
    insertTeam: "INSERT INTO teams (id, name, short_name, crest_url, competition_id) VALUES ($id, $name, $short_name, $crest_url, $competition_id)",
    allPlayers: "SELECT id, name from players",
    insertPlayer: "INSERT INTO players (name, team_id) VALUES ($name, $team_id)",
    hasFixtures: "SELECT * from fixtures WHERE competition_id == $competition_id LIMIT 1",
    insertFixture: "INSERT INTO fixtures (date, home_team_id, away_team_id, competition_id) VALUES ($date, $home_team_id, $away_team_id, $competition_id)",
    videoExists: "SELECT * FROM videos WHERE id == $id LIMIT 1",
    insertVideo: "INSERT INTO videos (id, source_id, date, title, url) VALUES ($id, (SELECT id FROM sources WHERE domain == $domain), $date, $title, $url)",
    getVideos: "SELECT videos.title, videos.url, sources.domain, videos.date FROM videos JOIN player_tags ON videos.id == player_tags.video_id JOIN sources ON videos.source_id == sources.id"
}

const orderbyNameString = " ORDER BY name ASC";

function prepareStatement(database: Locked<Database>, statement: string): Promise<Statement> {
    return database.access(function action(lockedDatabase: Database) {
        return lockedDatabase.prepare(statement);
    });
}

function prepareParameterNames(count: number) {
    return "(" + Array.from(Array(count)).map(() => "?").join(",") + ")";
}

export enum Sorting {
    asc,
    desc
};

function sortingString(column: string, order: Sorting) {
    switch (order) {
        case Sorting.asc:
            return " ORDER BY " + column + " ASC";
        case Sorting.desc:
            return " ORDER BY " + column + " DESC";
        default:
            return "";
    }
}

export class Interface {
    private footballData: FootballData;

    private allCountriesStatement: Promise<Statement>;
    private allCompetitionsStatement: Promise<Statement>;
    private allTeamsStatement: Promise<Statement>;
    private insertTeamStatement: Promise<Statement>;
    private allPlayersStatement: Promise<Statement>;
    private insertPlayerStatement: Promise<Statement>;
    private hasFixturesStatement: Promise<Statement>;
    private insertFixtureStatement: Promise<Statement>;
    private videoExistsStatement: Promise<Statement>;
    private insertVideoStatement: Promise<Statement>;

    constructor(private database: Locked<Database>) {
        this.footballData = new FootballData();

        this.allCountriesStatement = prepareStatement(database, statementStrings.allCountries + orderbyNameString);
        this.allCompetitionsStatement = prepareStatement(database, statementStrings.allCompetitions + orderbyNameString);
        this.allTeamsStatement = prepareStatement(database, statementStrings.allTeams + orderbyNameString);
        this.insertTeamStatement = prepareStatement(database, statementStrings.insertTeam);
        this.allPlayersStatement = prepareStatement(database, statementStrings.allPlayers + orderbyNameString);
        this.insertPlayerStatement = prepareStatement(database, statementStrings.insertPlayer);
        this.insertFixtureStatement = prepareStatement(database, statementStrings.insertFixture);
        this.hasFixturesStatement = prepareStatement(database, statementStrings.hasFixtures);
        this.videoExistsStatement = prepareStatement(database, statementStrings.videoExists);
        this.insertVideoStatement = prepareStatement(database, statementStrings.insertVideo);
    }

    private runSimpleAllStatement<Result>(statementPromise: Promise<Statement>): Promise<Result[]> {
        return this.database.access(() => statementPromise.then(statement => statement.all({})));
    }

    private runAllStatement<Result>(statement: string, options: any[]): Promise<Result[]> {
        var optionsObject: { [index: number]: any } = {};

        for (var n = 0; n < options.length; ++n) {
            optionsObject[n + 1] = options[n];
        }
        return this.database.access(database => database.all(statement, optionsObject));
    }

    private insertItems<ItemType>(statementPromise: Promise<Statement>, items: ItemType[], getOptions: (item: ItemType) => {}) {
        return this.database.access(function action(database) {
            return Promise.all(items.map(function insertItem(item) {
                return statementPromise.then(statement => statement.run(getOptions(item))).catch(function handleError(error: Error) {
                    console.error("Could not insert item %s: %s", item, error.message);
                });
            })).then(() => { });
        });
    }

    getAllCountries() {
        return this.runSimpleAllStatement<databaseTypes.Country>(this.allCountriesStatement);
    }

    getAllCompetitions() {
        return this.runSimpleAllStatement<databaseTypes.Competition>(this.allCompetitionsStatement);
    }

    getCompetitions(countries: number[]) {
        if (countries.length == 0) {
            return this.getAllCompetitions();
        } else {
            const statement = statementStrings.allCompetitions + " WHERE country_id IN " + prepareParameterNames(countries.length) + orderbyNameString;

            return this.runAllStatement<databaseTypes.Competition>(statement, countries);
        }
    }

    getAllTeams() {
        return this.runSimpleAllStatement<databaseTypes.Team>(this.allTeamsStatement);
    }

    getTeams(competitions: number[]) {
        if (competitions.length == 0) {
            return this.getAllTeams();
        } else {
            const statement = statementStrings.allTeams + " WHERE competition_id IN " + prepareParameterNames(competitions.length) + orderbyNameString;

            return this.runAllStatement<databaseTypes.Team>(statement, competitions);
        }
    }

    insertTeams(teams: footballDataTypes.Teams, competitionID: number) {
        return this.insertItems(this.insertTeamStatement, teams.teams, function getOptions(team) {
            return {
                $id: footballDataTypes.getTeamID(team),
                $name: team.name,
                $short_name: team.shortName,
                $crest_url: team.crestUrl,
                $competition_id: competitionID
            };
        });
    }

    getAllPlayers() {
        return this.runSimpleAllStatement<databaseTypes.Player>(this.allPlayersStatement);
    }

    getPlayers(teams: number[]) {
        if (teams.length == 0) {
            return this.getAllPlayers();
        } else {
            const statement = statementStrings.allPlayers + " WHERE team_id IN " + prepareParameterNames(teams.length) + orderbyNameString;

            return this.runAllStatement<databaseTypes.Player>(statement, teams);
        }
    }

    insertPlayers(players: footballDataTypes.Players, teamID: number) {
        return this.insertItems(this.insertPlayerStatement, players.players, function getOptions(player) {
            return {
                $name: player.name,
                $team_id: teamID
            }
        });
    }

    hasFixtures(competitionID: number) {
        const self = this;
        return self.database.access(() => self.hasFixturesStatement.then(statement => statement.all({
            $competition_id: competitionID
        }))).then(fixtures => fixtures.length > 0);
    }

    insertFixtures(fixtures: footballDataTypes.Fixtures, competitionID: number) {
        return this.insertItems(this.insertFixtureStatement, fixtures.fixtures, function getOptions(fixture) {
            return {
                $date: Math.floor(Date.parse(fixture.date) / 1000),
                $home_team_id: footballDataTypes.getHomeTeamID(fixture),
                $away_team_id: footballDataTypes.getAwayTeamID(fixture),
                $competition_id: competitionID
            }
        });
    }

    videoExists(videoID: string) {
        const self = this;
        return self.database.access(() => self.videoExistsStatement.then(statement => statement.all({
            $id: videoID
        }))).then(videos => videos.length > 0);
    }

    insertVideo(video: RedditVideo) {
        const self = this;
        return self.database.access(() => self.insertVideoStatement.then(statement => statement.run({
            $id: video.redditId,
            $domain: video.domain,
            $date: video.creationTime,
            $title: video.title,
            $url: video.url
        })));
    }

    getVideos(players: number[], order: Sorting) {
        var statement;
        if (players.length == 0) {
            statement = statementStrings.getVideos;
        } else {
            statement = statementStrings.getVideos + " WHERE player_tags.player_id IN " + prepareParameterNames(players.length);
        }

        statement += sortingString("videos.date", order);

        return this.runAllStatement<databaseTypes.Video>(statement, players);
    }
}
