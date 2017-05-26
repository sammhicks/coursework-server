
import { HasLink } from "../reddit";
import { Video } from "./video";

export interface Domain {
    domain: string;

    resolve: (link: HasLink) => Promise<Video>;
}
