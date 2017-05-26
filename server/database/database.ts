import { Locked } from "../../promises/lock";
import { Database, Statement } from "../../promises/sqlite3";

import * as databaseTypes from "./database-types";
import { FootballData } from "./football-data";
import * as footballDataTypes from "./football-data-types";
import { Video as RedditVideo } from "./domains";

/*function createInsertTag(table: string) {
    return "INSERT INTO " + table + "_tags (video_id, " + table + "_id) VALUES ($video_id, $tag_id)";
}*/

const statementStrings = {
    allCountries: "SELECT id, name FROM countries",
    allCompetitions: "SELECT id, name FROM competitions",
    allTeams: "SELECT id, name, short_name, crest_url from teams",
    insertTeam: "INSERT INTO teams (id, name, short_name, crest_url, competition_id) VALUES ($id, $name, $short_name, $crest_url, $competition_id)",
    allPlayers: "SELECT id, name from players",
    insertPlayer: "INSERT INTO players (name, team_id) VALUES ($name, $team_id)",
    insertFixture: "INSERT INTO fixtures (date, home_team_id, away_team_id, competition_id) VALUES ($date, $home_team_id, $away_team_id, $competition_id)",
    /*insertCountryTag: createInsertTag("country"),
    insertCompetitionTag: createInsertTag("competition"),
    insertTeamTag: createInsertTag("team"),
    insertPlayerTag: createInsertTag("player"),*/
}

function prepareStatement(database: Locked<Database>, statement: string): Promise<Statement> {
    return database.access(function action(lockedDatabase: Database) {
        return lockedDatabase.prepare(statement);
    });
}

function prepareParameterNames(count: number) {
    return "(" + Array.from(Array(count)).map(() => "?").join(",") + ")";
}

export class Interface {
    private footballData: FootballData;

    private allCountriesStatement: Promise<Statement>;
    private allCompetitionsStatement: Promise<Statement>;
    private allTeamsStatement: Promise<Statement>;
    private insertTeamStatement: Promise<Statement>;
    private allPlayersStatement: Promise<Statement>;
    private insertPlayerStatement: Promise<Statement>;
    private insertFixtureStatement: Promise<Statement>;
    /*private insertCountryTagStatement: Promise<Statement>;
    private insertCompetitionTagStatement: Promise<Statement>;
    private insertTeamTagStatement: Promise<Statement>;
    private insertPlayerTagStatement: Promise<Statement>;*/

    constructor(private database: Locked<Database>) {
        this.footballData = new FootballData();

        this.allCountriesStatement = prepareStatement(database, statementStrings.allCountries);
        this.allCompetitionsStatement = prepareStatement(database, statementStrings.allCompetitions);
        this.allTeamsStatement = prepareStatement(database, statementStrings.allTeams);
        this.insertTeamStatement = prepareStatement(database, statementStrings.insertTeam);
        this.allPlayersStatement = prepareStatement(database, statementStrings.allPlayers);
        this.insertPlayerStatement = prepareStatement(database, statementStrings.insertPlayer);
        this.insertFixtureStatement = prepareStatement(database, statementStrings.insertFixture);
        //this.insertCountryTagStatement = prep
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
            const statement = statementStrings.allCountries + " WHERE country_id IN " + prepareParameterNames(countries.length);

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
            const statement = statementStrings.allTeams + " WHERE competition_id IN " + prepareParameterNames(competitions.length);

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
            const statement = statementStrings.allPlayers + " WHERE team_id IN " + prepareParameterNames(teams.length);

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

    /*private insertTags(statementPromise: Promise<Statement>, videoID: string, tags: databaseTypes.Tag[], getTagID: (tag: databaseTypes.Tag) => number) {
        return this.insertItems(statementPromise, tags, function getOptions(tag) {
            return {
                $video_id: tag.video_id,
                $tag_id: getTagID(tag)
            }
        });
    }

    private getTags*/
}

/*export class Interface {
    insertStatement: Promise<Statement>;
    videoExistsStatement: Promise<Statement>;
    allVideosStatement: Promise<Statement>;

    constructor(private database: Locked<Database>) {
        this.insertStatement = prepareStatement(database, "INSERT INTO videos VALUES ($id, (SELECT id FROM sources WHERE domain=$domain), $creation_time, $title, $url)");
        this.videoExistsStatement = prepareStatement(database, "SELECT COUNT(*) as count FROM videos WHERE videos.id == $id");
        this.allVideosStatement = prepareStatement(database, "SELECT sources.domain, videos.creation_time, videos.title, videos.url FROM sources JOIN videos WHERE sources.id = videos.source_id ORDER BY videos.creation_time DESC");
    }

    insertVideo(video: RedditVideo): Promise<void> {
        const self = this;
        return self.database.access(function insideLock() {
            return self.insertStatement.then(function runStatement(statement: Statement) {
                return statement.run({
                    $id: video.redditId,
                    $creation_time: video.creationTime,
                    $domain: video.domain,
                    $title: video.title,
                    $url: video.url
                }).then((function handleSuccess() { }), function handleError(error: Error) {
                    console.error("Error inserting %s: %s", video.redditId, error.message);
                    return Promise.reject(error);
                })
            });
        });
    }

    videoExists(id: string) {
        const self = this;
        return self.database.access(function insideLock() {
            return self.videoExistsStatement.then(function runStatement(statement: Statement) {
                return statement.get({
                    $id: id
                }).then((function handleSuccess(result: any) {
                    return result.count > 0;
                }), function handleError(error: Error) {
                    console.error("Error querying %s: %s", id, error.message);
                    throw error;
                })
            });
        });
    }

    allVideos(): Promise<any[]> {
        var self = this;
        return self.database.access(function insideLock() {
            return this.allVideosStatement.then(function handleStatement(statement: Statement) {
                return statement.all({}).catch(function handleError(error: Error) {
                    console.error("Failed to fetch all videos");
                });
            }).catch(function handleError() {
                return <any[]>[];
            })
        });
    }
}
*/
