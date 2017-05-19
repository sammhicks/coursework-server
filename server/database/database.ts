import * as sqlite3 from "sqlite3";

import { Video } from "./video";

export class Interface {
    insertStatement: sqlite3.Statement;

    constructor(private database: sqlite3.Database) {
        this.insertStatement = database.prepare('INSERT INTO "videos" ("source_id", "reddit_id", "creation_time", "title", "url") VALUES ((SELECT "id" FROM "sources" WHERE "domain"=$domain), $rid, $creation_time, $title, $url)');
    }

    insert(video: Video) {
        if (video != null) {
            this.insertStatement.run({
                $creation_time: video.creationTime,
                $domain: video.domain,
                $rid: video.redditId,
                $title: video.title,
                $url: video.url
            }, function handleError(error: Error) {
                if (error != null) {
                    console.error("Error inserting", video.redditId);
                }
            });
        }
    }
}
