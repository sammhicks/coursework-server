import { Interface as DatabaseInterface } from "./database"
import { FootballData } from "./football-data";
import { getTeamID } from "./football-data-types";

export function crawl(database: DatabaseInterface) {
    const footballData = new FootballData();

    return database.getAllCompetitions().then(competitions => Promise.all(competitions.map(function crawlCompetition(competition) {
        return database.getTeams([competition.id])
            .then(function checkTeamsCrawled(teams) {
                if (teams.length > 0) {
                    return Promise.resolve();
                } else {
                    return footballData.getTeams(competition.id)
                        .then(teams => database.insertTeams(teams, competition.id).then(() => teams))
                        .then(teams => Promise.all(teams.teams.map(function crawlTeam(team) {
                            const teamID = getTeamID(team);
                            return database.getPlayers([teamID]).then(function checkTeamCrawled(players) {
                                if (players.length > 0) {
                                    return Promise.resolve();
                                } else {
                                    return footballData.getPlayers(teamID)
                                        .then(players => database.insertPlayers(players, teamID).then(() => { }));
                                }
                            });
                        })).then(() => { }));
                }
            })
    })).then(() => { })).then(() => { console.log("Finished crawling Football-Data"); });
}
