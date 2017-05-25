import * as url from "url";

export interface Link {
    href: string;
}

export function getResourceID(link: Link) {
    const resourcePath = url.parse(link.href).pathname.split("/");
    return parseInt(resourcePath[resourcePath.length - 1], 10);
}
