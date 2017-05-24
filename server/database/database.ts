import { Locked } from "../../promises/lock";
import { Database, Statement } from "../../promises/sqlite3";

import { Video } from "./video";

function prepareStatement(database: Locked<Database>, statement: string): Promise<Statement> {
    return database.access(function action(lockedDatabase: Database) {
        return lockedDatabase.prepare(statement);
    });
}

export class Interface {
    insertStatement: Promise<Statement>;
    videoExistsStatement: Promise<Statement>;
    allVideosStatement: Promise<Statement>;

    constructor(private database: Locked<Database>) {
        this.insertStatement = prepareStatement(database, "INSERT INTO videos VALUES ($id, (SELECT id FROM sources WHERE domain=$domain), $creation_time, $title, $url)");
        this.videoExistsStatement = prepareStatement(database, "SELECT COUNT(*) as count FROM videos WHERE videos.id == $id");
        this.allVideosStatement = prepareStatement(database, "SELECT sources.domain, videos.creation_time, videos.title, videos.url FROM sources JOIN videos WHERE sources.id = videos.source_id ORDER BY videos.creation_time DESC");
    }

    insert(video: Video): Promise<void> {
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
