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
            new String("Programming wizard. Old man. Lead back-end developer. May actually be a lizard person. Knows more Haskell than you. Handy with an accordian.")
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
    new Element("h1", {}, [
        new String("10 Commandments of Ball 2 Hand")
    ]),
    new Element("p", { class: "commandmentItem" }, [
        new String("I: Thou shalt not use any other websites for football videos")
    ]),
    new Element("p", { class: "commandmentItem" }, [
        new String("II: Thou shalt give us full marks")
    ]),
    new Element("p", { class: "commandmentItem" }, [
        new String("III: Thou shalt tell all your friends about this website")
    ]),
    new Element("p", { class: "commandmentItem" }, [
        new String("IV: Thou must put faith in Reddit's API")
    ]),
    new Element("p", { class: "commandmentItem" }, [
        new String("V: Thou must not copy this website idea")
    ]),
    new Element("p", { class: "commandmentItem" }, [
        new String("VI: Thou shalt not repeat commandments because you hath run out of ideas")
    ]),
    new Element("p", { class: "commandmentItem" }, [
        new String("VII: Thou shalt not repeat commandments because you hath run out of ideas")
    ]),
    new Element("p", { class: "commandmentItem" }, [
        new String("VIII: Thou must not beg for more leagues")
    ]),
    new Element("p", { class: "commandmentItem" }, [
        new String("IX: Thou must enjoy the animation in the footer")
    ]),
    new Element("p", { class: "commandmentItem" }, [
        new String("X: Thou must be bored if you have got this far")
    ])
])

var aboutPage = new Page("About Us", ["about.css"], [], new Element("div", { class: "aboutContent", id: "aboutContent" }, [
    imageWrap,
    commandments
]));

export var about = new LeafHandler(new HTMLHandler(aboutPage));
