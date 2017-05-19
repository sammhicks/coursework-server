import * as httpStatus from "http-status-codes"
import * as url from "url";
import * as requestPromise from "request-promise-native";
import { StatusCodeError } from "request-promise-native/errors"

import { Domain } from "./domain";
import { createDelay } from "../../../promises";
import { HasLink } from "../reddit";
import { Video as CrawledVideo } from "../video";

export enum VideoStatus {
    UPOADING = 0,
    PROCESSING = 1,
    READY = 2,
    ERROR = 3
}

export interface Video {
    status: VideoStatus;
    files: VideoFiles;
    thumbnail_url: string;
    source: string;
    title: string;
    url: string;
}

interface VideoFiles {
    "mp4"?: VideoFile;
    "mp4-mobile"?: VideoFile;
}

export interface VideoFile {
    url: string;
}

export class Streamable implements Domain {
    domain: string;

    constructor() {
        this.domain = "streamable.com";
    }

    resolve(link: HasLink): Promise<CrawledVideo> {
        const self = this;
        const shortcode = url.parse(link.data.url).pathname;
        return requestPromise("https://api.streamable.com/videos" + shortcode).catch(function handleError(error: StatusCodeError) {
            if (error.statusCode == httpStatus.TOO_MANY_REQUESTS) {
                return createDelay(parseInt(error.response.headers["retry-after"]) * 1000)().then(function tryAgain() {
                    self.resolve(link);
                });
            } else {
                console.error("Error processing streamable with shortcode \"%s\": %j", shortcode, error.message);
                throw error;
            }
        }).then(JSON.parse).then(function handleVideo(video: Video): Promise<CrawledVideo> {
            if (video.status == VideoStatus.READY && video.files.mp4 != null) {
                return Promise.resolve(new CrawledVideo(link.data.id, (link.data.title + " " + video.title).trim(), self.domain, "https:" + video.files.mp4.url));
            } else {
                throw new Error();
            }
        }).catch(function handleError() {
            return Promise.resolve(null);
        });
    }
}
