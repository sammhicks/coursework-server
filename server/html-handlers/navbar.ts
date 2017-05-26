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
        new Element("a", { href: "about.html", title: "About Us" }, [
            new String("About Us")
        ]),
        new Element("a", { href: "about_us.html", title: "About Us" }, [
            new Element("i", { class: "fa fa-users" }, [])
        ])
    ]),
    new Element("span", {}, [
        new Element("a", { href: "blog.html", title: "Blog" }, [
            new String("Blog")
        ]),
        new Element("a", { href: "blog.html", title: "Blog" }, [
            new Element("i", { class: "fa fa-pencil-square" }, [])
        ])
    ]),
    new Element("span", {}, [
        new Element("a", { href: "privacy_policy.html", title: "Privacy Policy" }, [
            new String("Privacy Policy")
        ]),
        new Element("a", { href: "privacy_policy.html", title: "Privacy Policy" }, [
            new Element("i", { class: "fa fa-user-secret" }, [])
        ])
    ]),
    new Element("span", {}, [
        new Element("a", { href: "faqs.html", title: "FAQs" }, [
            new String("FAQs")
        ]),
        new Element("a", { href: "faqs.html", title: "FAQs" }, [
            new Element("i", { class: "fa fa-question-circle" }, [])
        ])
    ]),
    new Element("span", {}, [
        new Element("a", { href: "contact_us.html", title: "Contact Us" }, [
            new String("Contact Us")
        ]),
        new Element("a", { href: "contact_us.html", title: "Contact Us" }, [
            new Element("i", { class: "fa fa-envelope" }, [])
        ])
    ]),
    /*new Element("span", {}, [
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
    ]),*/
    new Element("form", {}, [
        new Element("input", { type: "text", title: "Search", id: "search" })
    ])
]);
