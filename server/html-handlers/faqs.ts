import { Element, Literal, String } from "../../html";
import { HTMLHandler, LeafHandler } from "../../handlers";
import { Page } from "./page";


var faqsPage = new Page("FAQs", ["extrapages.css"], [], new Element("div", {}, [
    new Element("p", {}, [
        new String("Q: What is the meaning of life?")
    ]),
    new Element("p", {}, [
        new String("A: To watch football videos on our website of course, now get back to it.")
    ])
]));

export var faqs = new LeafHandler(new HTMLHandler(faqsPage));
