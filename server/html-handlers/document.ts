import { Document, Element, String } from "../../html";
import { HTMLHandler, LeafHandler } from "../../handlers";

export var document = new LeafHandler(new HTMLHandler(new Document("en-GB", "My Document", {}, ["index.css"], ["index.js"], new Element(
    "body", {}, [
        new Element("h1", {}, [
            new String("Hello World")
        ])
    ]
))))