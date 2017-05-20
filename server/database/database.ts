import { Database as SqliteDatabase, Statement as SqliteStatement } from "sqlite3";
import { Database, Statement } from "../../promises/sqlite3";

import { Video } from "./video";

export class Inserter {
    statement: SqliteStatement;

    constructor(private database: SqliteDatabase) {
        this.statement = database.prepare("INSERT INTO videos (source_id, reddit_id, creation_time, title, url) VALUES ((SELECT id FROM sources WHERE domain=$domain), $rid, $creation_time, $title, $url)");
    }

    insert(video: Video): void {
        if (video != null) {
            this.statement.run({
                $creation_time: video.creationTime,
                $domain: video.domain,
                $rid: video.redditId,
                $title: video.title,
                $url: video.url
            }, function handleError(error: Error) {
                if (error != null) {
                    console.error("Error inserting %s: %s", video.redditId, error.message);
                }
            });
        }
    }
}

export class Fetcher {
    allVideosStatement: Promise<Statement>;

    constructor(database: Promise<Database>) {
        this.allVideosStatement = database.then(function prepareStatement(database: Database) {
            return database.prepare("SELECT sources.domain, videos.creation_time, videos.title, videos.url FROM sources JOIN videos WHERE sources.id = videos.source_id ORDER BY videos.creation_time DESC");
        }).catch(function handleError(error: Error) {
            console.error("Failed to prepare All Videos Statement:", error.message);
        });
    }

    allVideos(): Promise<any[]> {
        return this.allVideosStatement.then(function handleStatement(statement: Statement) {
            return statement.all({}).catch(function handleError(error: Error) {
                console.error("Failed to fetch all videos");
            });
        }).catch(function handleError() {
            return [];
        })
    }
}
