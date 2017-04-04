import { Document, Element, String } from "../../html";
import { HTMLHandler, LeafHandler } from "../../handlers";

var language = "en-GB";

var title = "Home of Football";

var meta = {
    "msapplication-TileColor": "#FFFFFF",
    "msapplication-TileImage": "Images/Favicon/favicon-144.png",
    "msapplication-config": "/browserconfig.xml",
    "viewport": "initial-scale=1, width=device-width"
};

var stylesheets = [
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
    "test.css"
];

var scripts = [
    "script.js"
];

var body = new Element(
    "body", {}, [
        //new Element("h1", {}, [
        //    new String("Hello World")
        //])

        //navbar
        new Element("nav", { class: "navbar", id: "navbar" }, [
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
                new Element("input", { type: "text", title: "Search", id: "search" }, [])
            ])
        ]),

        //content
        new Element("div", { class: "contentWrapper", id: "contentWrapper" }, [
            new Element("div", { class: "homepageContent", id: "homepageContent" }, [

                //header
                new Element("div", { class: "header", id: "header" }, [
                    new Element("img", { src: "Images/logoOrangeGrey.svg", alt: "Logo Orange and Grey", onerror: "this.src='logoOrangeGrey.png'", style: "max-height: 72px; max-width: 100px", id: "logopos1" }, []),
                    new Element("h1", {}, [
                        new String("Ball To Hand")
                    ]),
                    new Element("img", { src: "Images/logoOrangeGrey.svg", alt: "Logo Orange and Grey", onerror: "this.src='logoOrangeGrey.png'", style: "max-height: 100px; max-width: 100px", id: "logopos2" }, []),
                    new Element("hr", { style: "border: 2px solid #1c2f2f" }, []),
                    new Element("p", {}, [
                        new String("Welcome to the hub of football media")
                    ])
                ]),

                //spacer
                new Element("div", { style: "height: 30px;" }, []),

                //search module shit
                new Element("div", { class: "searchModulesContainer", id: "searchModulesContainer" }, [
                    new Element("ul", { class: "searchModule", id: "searchModule" }, [
                        new Element("li", { tabindex: "0" }, [
                            new Element("div", { class: "searchModuleImage" }, [
                                new Element("img", { src: "Images/search.svg", alt: "Quick Search", onerror: "this.src='search.png'" }, [])
                            ]),
                            new Element("div", { class: "searchModuleLabel" }, [
                                new String("Quick Search")
                            ])
                        ]),
                        new Element("li", { tabindex: "0" }, [
                            new Element("div", { class: "searchModuleImage" }, [
                                new Element("img", { src: "Images/media.svg", alt: "Search By Media Type", onerror: "this.src='media.png'" }, [])
                            ]),
                            new Element("div", { class: "searchModuleLabel" }, [
                                new String("Search By Media Type")
                            ])
                        ]),
                        new Element("li", { tabindex: "0" }, [
                            new Element("div", { class: "searchModuleImage" }, [
                                new Element("img", { src: "Images/calendar.svg", alt: "Search By Date", onerror: "this.src='calendar.png'" }, [])
                            ]),
                            new Element("div", { class: "searchModuleLabel" }, [
                                new String("Search By Date")
                            ])
                        ]),
                        new Element("li", { tabindex: "0" }, [
                            new Element("div", { class: "searchModuleImage" }, [
                                new Element("img", { src: "Images/podium.svg", alt: "Order Method", onerror: "this.src='podium.png'" }, [])
                            ]),
                            new Element("div", { class: "searchModuleLabel" }, [
                                new String("Order Method")
                            ])
                        ]),
                        new Element("li", { tabindex: "0" }, [
                            new Element("div", { class: "searchModuleImage" }, [
                                new Element("img", { src: "Images/country.svg", alt: "Search By Country", onerror: "this.src='country.png'" }, [])
                            ]),
                            new Element("div", { class: "searchModuleLabel" }, [
                                new String("Search By Country")
                            ])
                        ]),
                        new Element("li", { tabindex: "0" }, [
                            new Element("div", { class: "searchModuleImage" }, [
                                new Element("img", { src: "Images/trophy.svg", alt: "Search By Competition", onerror: "this.src='trophy.png'" }, [])
                            ]),
                            new Element("div", { class: "searchModuleLabel" }, [
                                new String("Search By Competition")
                            ])
                        ]),
                        new Element("li", { tabindex: "0" }, [
                            new Element("div", { class: "searchModuleImage" }, [
                                new Element("img", { src: "Images/club.svg", alt: "Search By Club", onerror: "this.src='club.png'" }, [])
                            ]),
                            new Element("div", { class: "searchModuleLabel" }, [
                                new String("Search By Club")
                            ])
                        ]),
                        new Element("li", { tabindex: "0" }, [
                            new Element("div", { class: "searchModuleImage" }, [
                                new Element("img", { src: "Images/player.svg", alt: "Search By Player", onerror: "this.src='player.png'" }, [])
                            ]),
                            new Element("div", { class: "searchModuleLabel" }, [
                                new String("Search By Player")
                            ])
                        ])
                    ])
                ]),

                //latest goal
                new Element("p", {}, [
                    new String("Latest goal from around the world")
                ]),

                //video shit
                new Element("div", { class: "video-wrapper" }, [
                    new Element("div", { class: "video-player-wrapper", tabindex: "0" }, [
                        new Element("span", {}, [
                            new Element("div", { class: "video-container", id: "testyfull" }, [
                                new Element("video", { width: "1280", height: "720", id: "myvideo" }, [
                                    new Element("source", { src: "https://u.nya.is/oobaxw.mp4" }, []),
                                    new String("Your browser does not support the video tag.")
                                ]),
                                new Element("div", { class: "video-controls", id: "controls" }, [
                                    new Element("div", { class: "video-controls-seek", id: "seekback" }, [
                                        new Element("div", { id: "seek" }, [])
                                    ]),
                                    new Element("div", { class: "video-controls-play-pause", id: "play" }, [
                                        new Element("i", { class: "fa fa-play", id: "playicon" }, [])
                                    ]),
                                    new Element("div", { class: "video-controls-time" }, [
                                        new Element("div", { id: "currenttime" }, [
                                            new String("13:37")
                                        ]),
                                        new Element("div", {}, [
                                            new String("/")
                                        ]),
                                        new Element("div", { id: "endtime" }, [
                                            new String("69:69")
                                        ])
                                    ]),
                                    new Element("div", { class: "video-controls-volume", id: "volume" }, [
                                        new Element("i", { class: "material-icons md-48", id: "volicon" }, [
                                            new String("volume_up")
                                        ])
                                    ]),
                                    new Element("div", { class: "video-controls-volume-content" }, [
                                        new Element("div", { id: "volbarback" }, [
                                            new Element("div", { id: "volbar" }, [])
                                        ])
                                    ]),
                                    new Element("div", { class: "video-controls-fullscreen", id: "fullscreen" }, [
                                        new Element("i", { class: "material-icons md-48", id: "fullicon" }, [
                                            new String("fullscreen")
                                        ])
                                    ]),
                                    new Element("div", { class: "video-controls-settings" }, [
                                        new Element("i", { class: "fa fa-cog" }, [])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ])
            ])
        ]),

        //footer
        new Element("footer", { class: "footer" }, [
            new Element("div", { style: "text-align: right; margin-right: 40px;" }, [
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
                            new Element("a", { href: "images.html", title: "Images" }, [
                                new String("Images")
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
                new Element("img", { src: "Images/footerBannerP1.svg", alt: "Footer Banner Left", onerror: "this.src='Images/footerBannerP1.png'" }, []),
                new Element("span", { id: "footerquote" }, [
                    new Element("span", { id: "footerquoteText" }, [
                        new String("REF")
                    ])
                ]),
                new Element("img", { src: "Images/footerBannerP2.svg", alt: "Footer Banner Right", onerror: "this.src='Images/footerBannerP2.png'", id: "footerball" }, []),
                new Element("span", { id: "copyright" }, [
                    new String("&copy MMLXIX - Michael \"Long Dick Stamina\" Nicholas and Sam \"Hood Nigga\" Hicks")
                ])
            ])
        ])
    ]
)

export var home = new LeafHandler(new HTMLHandler(new Document(language, title, meta, stylesheets, scripts, body)));
