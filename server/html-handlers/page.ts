import { Document, Element, Literal, String } from "../../html";
import { HTMLHandler, LeafHandler } from "../../handlers";

import { footer } from "./footer";
import { navbar } from "./navbar";

var language = "en-GB";

var getTitle = (page: string) => "Home of Football" + (page == "" ? "" : " - " + page);

var meta = {
    "msapplication-TileColor": "#FFFFFF",
    "msapplication-TileImage": "Images/Favicon/favicon-144.png",
    "msapplication-config": "/browserconfig.xml",
    "viewport": "initial-scale=1, width=device-width"
};

var stylesheets = [
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
    "test.css"
];

var scripts = [
    "script.js"
];

var getBody = (content: Element) => new Element("body", {}, [navbar, content, footer]);

export class Page extends Document {
    constructor(title: string, additionalStylesheets: string[], additionalScripts: string[], content: Element) {
        super(language, getTitle(title), meta, stylesheets.concat(additionalStylesheets), scripts.concat(additionalScripts), getBody(content));
    }
}
