import { Element } from "./element";

export class Favicon extends Element {
    constructor(type: string, sizes: string, href: string) {
        super("link", { "rel": "icon", "type": type, "sizes": sizes, "href": href });
    }
}
