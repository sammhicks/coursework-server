import * as httpStatus from "http-status-codes"
import * as url from "url";
import * as requestPromise from "request-promise-native";
import { StatusCodeError } from "request-promise-native/errors"

import { Domain } from "./domain";
import { createDelay } from "../../../promises/delay";
import { HasLink } from "../reddit";
import { Video as CrawledVideo } from "./video";

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
        return requestPromise({
            url: "https://api.streamable.com/videos" + shortcode,
            json: true
        }).catch(function handleError(error: StatusCodeError) {
            if (error.statusCode == httpStatus.TOO_MANY_REQUESTS) {
                const timeout = parseInt(error.response.headers["retry-after"]);
                console.log("Retrying %s after %ds", shortcode, timeout);
                return createDelay(timeout * 1000)().then(() => self.resolve(link));
            } else {
                console.error("Error processing streamable with shortcode \"%s\": %j", shortcode, error.message);
                throw error;
            }
        }).then(function handleVideo(video: Video): Promise<CrawledVideo> {
            var url: string;
            if (video.status == VideoStatus.READY) {
                if (video.files["mp4"] != null && video.files["mp4"] != undefined) {
                    url = video.files["mp4"].url
                } else if (video.files["mp4-mobile"] != null && video.files["mp4-mobile"] != undefined) {
                    url = video.files["mp4-mobile"].url;
                } else {
                    throw new Error("video " + shortcode + " has no files");
                }
            } else {
                throw new Error("video " + shortcode + " is not ready");
            }
            return Promise.resolve(new CrawledVideo(link.data, self.domain, "https:" + url));
        });
    }
}
