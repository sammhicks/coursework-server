import { Element, Literal, String } from "../../html";
import { HTMLHandler, LeafHandler } from "../../handlers";
import { Page } from "./page";

const header = new Element("div", { class: "header", id: "header" }, [
    new Element("h1", { class: "title" }, [
        new Element("img", { src: "images/logo-orange-grey.svg", alt: "Logo Orange and Grey", id: "logopos1" }), ,
        new String("Ball To Hand")
    ]),
    new Element("img", { src: "images/logo-orange-grey.svg", alt: "Logo Orange and Grey", id: "logopos2" }),
    new Element("p", {}, [new String("Welcome to the hub of football media")])
]);

const spacer = new Element("div", { class: "spacer" }, []);

const search = new Element("div", { class: "searchModulesContainer", id: "searchModulesContainer" }, [
    new Element("ul", { class: "searchModule", id: "searchModule" }, [
        new Element("li", { tabindex: "0" }, [
            new Element("div", { class: "searchModuleImage" }, [
                new Element("img", { src: "images/search.svg", alt: "Quick Search" })
            ]),
            new Element("div", { class: "searchModuleLabel" }, [
                new String("Quick Search")
            ])
        ]),
        new Element("li", { tabindex: "0" }, [
            new Element("div", { class: "searchModuleImage" }, [
                new Element("img", { src: "images/media.svg", alt: "Search By Media Type" })
            ]),
            new Element("div", { class: "searchModuleLabel" }, [
                new String("Search By Media Type")
            ])
        ]),
        new Element("li", { tabindex: "0" }, [
            new Element("div", { class: "searchModuleImage" }, [
                new Element("img", { src: "images/calendar.svg", alt: "Search By Date" })
            ]),
            new Element("div", { class: "searchModuleLabel" }, [
                new String("Search By Date")
            ])
        ]),
        new Element("li", { tabindex: "0" }, [
            new Element("div", { class: "searchModuleImage" }, [
                new Element("img", { src: "images/podium.svg", alt: "Order Method" })
            ]),
            new Element("div", { class: "searchModuleLabel" }, [
                new String("Order Method")
            ])
        ]),
        new Element("li", { tabindex: "0" }, [
            new Element("div", { class: "searchModuleImage" }, [
                new Element("img", { src: "images/country.svg", alt: "Search By Country" })
            ]),
            new Element("div", { class: "searchModuleLabel" }, [
                new String("Search By Country")
            ])
        ]),
        new Element("li", { tabindex: "0" }, [
            new Element("div", { class: "searchModuleImage" }, [
                new Element("img", { src: "images/trophy.svg", alt: "Search By Competition" })
            ]),
            new Element("div", { class: "searchModuleLabel" }, [
                new String("Search By Competition")
            ])
        ]),
        new Element("li", { tabindex: "0" }, [
            new Element("div", { class: "searchModuleImage" }, [
                new Element("img", { src: "images/club.svg", alt: "Search By Club" })
            ]),
            new Element("div", { class: "searchModuleLabel" }, [
                new String("Search By Club")
            ])
        ]),
        new Element("li", { tabindex: "0" }, [
            new Element("div", { class: "searchModuleImage" }, [
                new Element("img", { src: "images/player.svg", alt: "Search By Player" })
            ]),
            new Element("div", { class: "searchModuleLabel" }, [
                new String("Search By Player")
            ])
        ])
    ])
]);

const latestGoal = new Element("p", {}, [
    new String("Latest goal from around the world")
])

const video = (url: string) => new Element("div", { class: "video-wrapper" }, [
    new Element("div", { class: "video-player-wrapper", tabindex: "0" }, [
        new Element("div", {}, [
            new Element("div", { class: "video-container", id: "testyfull" }, [
                new Element("video", { width: "1280", height: "720", id: "myvideo" }, [
                    new Element("source", { src: url }),
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
                    new Element("div", { class: "video-controls-settings", id: "settings" }, [
                        new Element("i", { class: "fa fa-cog" }, []),
                        new Element("div", { class: "video-controls-settings-menu", id: "settingsmenu" }, [
                            new Element("ul", {}, [
                                new Element("li", { id: "playbackspeed" }, [
                                    new String("Speed"),
                                    new Element("ul", {}, [
                                        new Element("li", { id: "playback-0.25x" }, [
                                            new String("0.25x")
                                        ]),
                                        new Element("li", { id: "playback-0.5x" }, [
                                            new String("0.5x")
                                        ]),
                                        new Element("li", { id: "playback-0.75x" }, [
                                            new String("0.75x")
                                        ]),
                                        new Element("li", { id: "playback-1x" }, [
                                            new String("Default")
                                        ]),
                                        new Element("li", { id: "playback-1.25x" }, [
                                            new String("1.25x")
                                        ]),
                                        new Element("li", { id: "playback-1.5x" }, [
                                            new String("1.5x")
                                        ]),
                                        new Element("li", { id: "playback-2x" }, [
                                            new String("2x")
                                        ])
                                    ])
                                ]),
                                new Element("li", { id: "playbackloop" }, [
                                    new String("Loop"),
                                ])
                            ])
                        ])
                    ])
                ])
            ])
        ])
    ])
])

const homePage = new Page("", [], [], new Element("div", { class: "homepageContent", id: "homepageContent" }, [
    header,
    spacer,
    search,
    latestGoal,
    video("https://u.nya.is/oobaxw.mp4")
]));

export const home = new LeafHandler(new HTMLHandler(homePage));
