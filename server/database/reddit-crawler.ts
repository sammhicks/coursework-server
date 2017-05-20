import * as requestPromise from "request-promise-native"
import * as sqlite3 from "sqlite3";
import * as url from "url";

import { Inserter } from "./database";
import { Domain, Mixtape, Streamable } from "./domains";
import { hasListing, hasLink, HasLink, Link, Listing, Thing } from "./reddit";
import { Video } from "./video";

import { Database } from "../../promises/sqlite3";

const domains: Domain[] = [new Mixtape(), new Streamable()];

const searchUrl = "https://www.reddit.com/r/soccer/search.json?q=" + domains.map(domain => "url%3A" + domain.domain).join("+OR+") + "&restrict_sr=true&sort=new&t=all&raw_json=1";

export function crawl(database: Database, after?: string) {
    console.log("Crawling: ", after);
    requestPromise(searchUrl + (after == undefined ? "" : ("&after=" + after))).then(JSON.parse).then(function handleThing(thing: Thing) {
        if (hasListing(thing)) {
            Promise.all(thing.data.children.map(function handleChild(child: Thing) {
                if (hasLink(child)) {
                    for (let n = 0; n < domains.length; ++n) {
                        if (domains[n].domain === child.data.domain) {
                            return domains[n].resolve(child);
                        }
                    }
                    return Promise.resolve(null);
                } else {
                    return Promise.resolve(null);
                }
            })).then(function handleResults(videos) {
                return database.serialize(function action(sqliteDatabase: sqlite3.Database) {
                    const videoInserter = new Inserter(sqliteDatabase);

                    videos.forEach(video => videoInserter.insert(video));

                    if (thing.data.after != null) {
                        setTimeout(() => crawl(database, thing.data.after), 1000);
                    } else {
                        console.log("Done scraping!");
                    }
                })
            }, function catchErrors(error: Error) {
                console.error(error);
            });
        }
    });
}