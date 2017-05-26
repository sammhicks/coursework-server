import { Element, Literal, String } from "../../html";
import { HTMLHandler, LeafHandler } from "../../handlers";
import { Page } from "./page";

var imageWrap = new Element("div", { class: "image-wrap" }, [
    new Element("img", { src: "images/about.png", alt: "Team Photo" }, []),
    new Element("div", { class: "bio-circle", id: "bio-circle-sam" }, []),
    new Element("div", { class: "bios", id: "samsBio" }, [
        new Element("span", {}, [
            new String("Samuel Hicks")
        ]),
        new Element("span", {}, [
            new String("Programming wizard. Old man. Lead back-end developer. May actually be a lizard person. Handy with an accordian.")
        ]),
    ]),
    new Element("div", { class: "bio-circle", id: "bio-circle-mike" }, []),
    new Element("div", { class: "bios", id: "mikesBio" }, [
        new Element("span", {}, [
            new String("Michael Nicholas")
        ]),
        new Element("span", {}, [
            new String("Basically Picasso. Young Upstart. Lead front-end developer. His mixtape is pure fire. Top footballer too I've heard.")
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
