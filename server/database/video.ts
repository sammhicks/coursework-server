import { Link } from "./reddit";

export class Video {
    redditId: string;
    creationTime: number;
    title: string;

    constructor(link: Link, public domain: string, public url: string) {
        this.redditId = link.id;
        this.creationTime = link.created_utc;
        this.title = link.title;
    }
}
