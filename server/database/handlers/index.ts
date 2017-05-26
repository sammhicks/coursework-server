
import { Interface as DatabaseInterface } from "../database";
import { DirectoryHandler } from "../../../handlers";
import { CountriesHandler } from "./countries";
import { CompetitionsHandler } from "./competitions";
import { TeamsHandler } from "./teams";

export class APIHandler extends DirectoryHandler {
    constructor(database: DatabaseInterface) {
        super({
            countries: new CountriesHandler(database),
            competitions: new CompetitionsHandler(database),
            teams: new TeamsHandler(database)
        })
    }
}
