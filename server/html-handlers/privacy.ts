import { Element, Literal, String } from "../../html";
import { HTMLHandler, LeafHandler } from "../../handlers";
import { Page } from "./page";

var privacyPage = new Page("Privacy Policy", ["extrapages.css"], [], new Element("div", {}, [
    new String("We don't steal your information, but we do know an african prince who's trying to give away a fortune if you're interested.")
]));

export var privacy = new LeafHandler(new HTMLHandler(privacyPage));
