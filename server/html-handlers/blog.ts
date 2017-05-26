import { Element, Literal, String } from "../../html";
import { HTMLHandler, LeafHandler } from "../../handlers";
import { Page } from "./page";



var blogPage = new Page("Blog", ["extrapages.css"], [], new Element("div", {}, [
    new String("Blogs are for kids.")
]));

export var blog = new LeafHandler(new HTMLHandler(blogPage));
