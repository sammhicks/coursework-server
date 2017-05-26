import { Document, Element, Favicon, String } from "../../html";

import { footer } from "./footer";
import { navbar } from "./navbar";

const language = "en-GB";

const getTitle = (page: string) => "Home of Football" + (page == "" ? "" : " - " + page);

const meta = {
    "msapplication-TileColor": "#FFFFFF",
    "msapplication-TileImage": "images/favicon/favicon-144.png",
    "msapplication-config": "images/favicon/browserconfig.xml",
    "viewport": "initial-scale=1, width=device-width"
};

function genFavicon(size: number) {
    return new Favicon("image/png", size + "x" + size, "images/favicon/favicon-" + size + ".png");
}

const favicons: Favicon[] = [196, 160, 96, 64, 32, 16].map(genFavicon);

const stylesheets = [
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
    //"test.css"
    "home.css",
    "main.css",
    "video.css",
    "navbar.css",
    "search-module.css",
    "footer.css"
];

const scripts = [
    "script.js"
];

const getBody = (content: Element) => new Element("body", {}, [navbar, content, footer]);

export class Page extends Document {
    constructor(title: string, additionalStylesheets: string[], additionalScripts: string[], content: Element) {
        super(language, getTitle(title), meta, favicons, stylesheets.concat(additionalStylesheets), scripts.concat(additionalScripts), getBody(content));
    }
}
