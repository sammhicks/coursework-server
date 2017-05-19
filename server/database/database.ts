import * as sqlite3 from "sqlite3";

import { Video } from "./video";

export class Interface {
    insertStatement: sqlite3.Statement;
    retreiveStatement: sqlite3.Statement;

    constructor(private database: sqlite3.Database) {
        this.insertStatement = database.prepare('INSERT INTO "videos" ("source_id", "reddit_id", "title", "url") VALUES ((SELECT "id" FROM "sources" WHERE "domain"=$domain), $rid, $title, $url)');
        this.retreiveStatement = database.prepare('SELECT sources.domain,videos.title,videos.url FROM videos JOIN sources WHERE sources.id=videos.source_id');
    }

    insert(video: Video) {
        if (video != null) {
            this.insertStatement.run({
                $domain: video.domain,
                $rid: video.redditId,
                $title: video.title,
                $url: video.url
            }, function handleError(error: Error) {
                console.error("Video %s already exists", video.redditId);
            });
        }
    }
}
