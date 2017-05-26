import * as url from "url";

import { Request } from "../../../request";
import { Sorting } from "../database";

export function getSorting(request: Request) {
    switch (request.query.sorting) {
        case "asc":
            return Sorting.asc;
        case "desc":
            return Sorting.desc;
        default:
            return null;
    }
}
