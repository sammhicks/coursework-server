
import { Fetcher } from "../database";
import { DirectoryHandler, Handler, LeafHandler, mimeTypes } from "../../../handlers";
import { AllVideosHandler } from "./all";

export class VideosAPIHandler extends DirectoryHandler {
    constructor(database: Fetcher) {
        super({
            all: new AllVideosHandler(database)
        })
    }
}
