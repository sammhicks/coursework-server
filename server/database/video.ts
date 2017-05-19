import { Link } from "./reddit";

export class Video {
    redditId: string;
    creationTime: number;

    constructor(link: Link, public title: string, public domain: string, public url: string) {
        this.redditId = link.id;
        this.creationTime = link.created_utc;
    }
}
