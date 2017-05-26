import { Element, Literal, String } from "../../html";
import { HTMLHandler, LeafHandler } from "../../handlers";
import { Page } from "./page";

var contactPage = new Page("Contact Us", ["extrapages.css"], [], new Element("div", {}, [
    new String("As if we would put our contact details on the interweb.")
]));

export var contact = new LeafHandler(new HTMLHandler(contactPage));
