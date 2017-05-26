import * as httpStatus from "http-status-codes";

import { Handler, LeafHandler, HandlerError } from "../../../handlers";
import { Request } from "../../../request";

import { Interface } from "../database";
import { Video } from "../database-types";

import { parseIndices } from "./indices";

import { getSorting } from "./sorting";

export function attachTagsToVideos(database: Interface, videos: Video[]) {
    return Promise.all(videos.map(video => attachTagsToVideo(database, video)));
}

export function attachTagsToVideosCurry(database: Interface) {
    return function attachTagsToVideosCurried(videos: Video[]) {
        return attachTagsToVideos(database, videos);
    }
}

function attachTagsToVideo(database: Interface, video: Video) {
    return Promise.all([
        database.getCountryTags(video.id),
        database.getCompetitionTags(video.id),
        database.getTeamTags(video.id),
        database.getPlayerTags(video.id)
    ]).then(function handleResults(results) {
        video.country_tags = results[0];
        video.competition_tags = results[1];
        video.team_tags = results[2];
        video.player_tags = results[3];

        return video;
    })
}

export class VideosHandler extends Handler {
    constructor(private database: Interface) {
        super();
    }

    handleRequest(request: Request): Promise<void> {
        const self = this;
        if (request.path.length === 0) {
            request.response.setHeader("Cache-Control", "no-store");
            return self.database.getAllVideos(getSorting(request))
                .then(attachTagsToVideosCurry(self.database))
                .then(Handler.handleJSONCurry(request));
        } else {
            return Promise.reject(new HandlerError(httpStatus.NOT_FOUND));
        }
    }
}
