import { Element, Literal, String } from "../../html";
import { HTMLHandler, LeafHandler } from "../../handlers";
import { Page } from "./page";

var imageWrap = new Element("div", { class: "image-wrap" }, [
    new Element("img", { src: "images/about.png", alt: "Team Photo" }, []),
    new Element("div", { class: "bios", id: "samsBio" }, [
        new Element("span", {}, [
            new String("Samuel Hicks")
        ]),
        new Element("span", {}, [
            new String("Programming wizard. Old man. Lead back-end developer. Not sure if he is not actually a lizard person.")
        ]),
    ]),
    new Element("div", { class: "bios", id: "mikesBio" }, [
        new Element("span", {}, [
            new String("Michael Nicholas")
        ]),
        new Element("span", {}, [
            new String("Basically Picasso. Young Upstart. Lead fron-end developer. ")
        ]),
    ])
]);

var commandments = new Element("div", { class: "commandments" }, [
    new Element("span", { class: "commandmentItem" }),
    new Element("span", { class: "commandmentItem" }),
    new Element("span", { class: "commandmentItem" }),
    new Element("span", { class: "commandmentItem" }),
    new Element("span", { class: "commandmentItem" }),
    new Element("span", { class: "commandmentItem" }),
    new Element("span", { class: "commandmentItem" }),
    new Element("span", { class: "commandmentItem" }),
    new Element("span", { class: "commandmentItem" }),
    new Element("span", { class: "commandmentItem" })
])

var aboutPage = new Page("", ["about.css"], [], new Element("div", { class: "aboutContent", id: "aboutContent" }, [
    imageWrap,
    commandments
]));

export var about = new LeafHandler(new HTMLHandler(aboutPage));
