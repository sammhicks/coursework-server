import { Domain } from "./domain"
import { HasLink } from "../reddit";
import { Video } from "../video";

export class Mixtape implements Domain {
    domain: string;

    constructor() {
        this.domain = "my.mixtape.moe";
    }

    resolve(link: HasLink): Promise<Video> {
        return Promise.resolve(new Video(link.data, this.domain, link.data.url));
    }
}
