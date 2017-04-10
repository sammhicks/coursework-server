import { Element, Literal, String } from "../../html";

export var navbar = new Element("nav", { class: "navbar", id: "navbar" }, [
    new Element("span", {}, [
        new Element("a", { href: "index.html", title: "Home" }, [
            new String("Home")
        ]),
        new Element("a", { href: "index.html", title: "Home" }, [
            new Element("i", { class: "material-icons md-24" }, [
                new String("home")
            ])
        ])
    ]),
    new Element("span", {}, [
        new Element("a", { href: "news.html", title: "News" }, [
            new String("News")
        ]),
        new Element("a", { href: "news.html", title: "News" }, [
            new Element("i", { class: "material-icons md-24" }, [
                new String("subject")
            ])
        ])
    ]),
    new Element("span", {}, [
        new Element("a", { href: "streams.html", title: "Streams" }, [
            new String("Streams")
        ]),
        new Element("a", { href: "streams.html", title: "Streams" }, [
            new Element("i", { class: "material-icons md-24" }, [
                new String("videocam")
            ])
        ])
    ]),
    new Element("span", {}, [
        new Element("a", { href: "videos.html", title: "Videos" }, [
            new String("Videos")
        ]),
        new Element("a", { href: "videos.html", title: "Videos" }, [
            new Element("i", { class: "material-icons md-24" }, [
                new String("play_circle_filled")
            ])
        ])
    ]),
    new Element("span", {}, [
        new Element("a", { href: "images.html", title: "Images" }, [
            new String("Images")
        ]),
        new Element("a", { href: "images.html", title: "Images" }, [
            new Element("i", { class: "material-icons md-24" }, [
                new String("image")
            ])
        ])
    ]),
    new Element("form", {}, [
        new Element("input", { type: "text", title: "Search", id: "search" })
    ])
]);
