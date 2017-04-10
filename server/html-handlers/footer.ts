import { Element, Literal, String } from "../../html";

export var footer = new Element("footer", { class: "footer" }, [
    new Element("div", { class: "topbutton-wrapper" }, [
        new Element("a", { href: "#top", title: "Back to Top" }, [
            new Element("i", { class: "material-icons md-24", id: "topbutton" }, [
                new String("arrow_upward")
            ])
        ])
    ]),
    new Element("div", { class: "footer-content" }, [
        new Element("ul", {}, [
            new Element("li", {}, [
                new Element("p", {}, [
                    new String("SiteMap")
                ]),
                new Element("nav", {}, [
                    new Element("a", { href: "index.html", title: "Home" }, [
                        new String("Home")
                    ]),
                    new Element("a", { href: "news.html", title: "News" }, [
                        new String("News")
                    ]),
                    new Element("a", { href: "streams.html", title: "Streams" }, [
                        new String("Streams")
                    ]),
                    new Element("a", { href: "videos.html", title: "Videos" }, [
                        new String("Videos")
                    ]),
                    new Element("a", { href: "images.html", title: "images" }, [
                        new String("images")
                    ])
                ])
            ]),
            new Element("li", {}, [
                new Element("p", {}, [
                    new String("About")
                ]),
                new Element("nav", {}, [
                    new Element("a", { href: "about_us.html", title: "About Us" }, [
                        new String("About Us")
                    ]),
                    new Element("a", { href: "blog.html", title: "Blog" }, [
                        new String("Blog")
                    ]),
                    new Element("a", { href: "privacy_policy.html", title: "Privacy Policy" }, [
                        new String("Privacy Policy")
                    ])
                ])
            ]),
            new Element("li", {}, [
                new Element("p", {}, [
                    new String("Help")
                ]),
                new Element("nav", {}, [
                    new Element("a", { href: "contact_us.html", title: "Contact Us" }, [
                        new String("Contact Us")
                    ]),
                    new Element("a", { href: "faqs.html", title: "FAQs" }, [
                        new String("FAQs")
                    ])
                ])
            ]),
            new Element("li", {}, [
                new Element("p", {}, [
                    new String("Connect")
                ]),
                new Element("nav", {}, [
                    new Element("a", { href: "#", id: "socialFB", title: "Facebook" }, [
                        new String("Facebook")
                    ]),
                    new Element("a", { href: "#", id: "socialTW", title: "Twitter" }, [
                        new String("Twitter")
                    ]),
                    new Element("a", { href: "#", id: "socialIN", title: "Instagram" }, [
                        new String("Instagram")
                    ])
                ])
            ])
        ])
    ]),
    new Element("div", { class: "footer-banner" }, [
        new Element("img", { src: "images/footer-banner-phone.svg", alt: "Footer Banner Phone" }),
        new Element("span", { id: "footerquote" }, [
            new Element("span", { id: "footerquoteText" }, [
                new String("GOAL")
            ])
        ]),
        new Element("img", { src: "images/footer-banner-ball.svg", alt: "Footer Banner Ball", id: "footerball" }),
        new Element("span", { id: "copyright" }, [
            new Literal("&#169;"),
            new String("MXVII - Michael Nicholas and Samuel Hicks")
        ])
    ])
])
