import * as requestPromise from "request-promise-native";
import * as url from "url";

import { Interface as DatabaseInterface } from "./database";
import { Domain, Mixtape, Streamable } from "./domains";
import { hasListing, hasLink, HasLink, Link, Listing, Thing } from "./reddit";
import { Video } from "./video";

import { Locked } from "../../promises/lock";
import { pFor } from "../../promises/loops";
import { Database } from "../../promises/sqlite3";

const domains: Domain[] = [new Mixtape(), new Streamable()];

const searchUrl = "https://www.reddit.com/r/soccer/search.json?q=" + domains.map(domain => "url%3A" + domain.domain).join("+OR+") + "&restrict_sr=true&sort=new&t=all&raw_json=1";

export function crawl(database: DatabaseInterface, after?: string) {
    console.log("Crawling: ", after);
    requestPromise(searchUrl + (after == undefined ? "" : ("&after=" + after))).then(JSON.parse).then(function handleThing(thing: Thing) {
        if (hasListing(thing)) {
            Promise.all(thing.data.children.map(function handleChild(child: Thing) {
                if (hasLink(child)) {
                    return database.videoExists(child.data.id).then(function handleExists(exists: boolean) {
                        if (!exists) {
                            for (let n = 0; n < domains.length; ++n) {
                                if (domains[n].domain === child.data.domain) {
                                    return domains[n].resolve(child).then(function insertVideo(video: Video) {
                                        database.insert(video);
                                    }, function handleError(error: Error) { });
                                }
                            }
                            return Promise.resolve();
                        } else {
                            return Promise.resolve();
                        }
                    });
                } else {
                    return Promise.resolve();
                }
            })).then(function handleResults(videos) {
                if (thing.data.after != null) {
                    setTimeout(() => crawl(database, thing.data.after), 1000);
                } else {
                    console.log("Done scraping!");
                }
            }, function catchErrors(error: Error) {
                console.error(error);
            });
        }
    });
}
