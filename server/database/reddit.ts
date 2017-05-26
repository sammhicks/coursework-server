export interface Thing {
    id: string;
    name: string;
    kind: string;

    data: any;
};

export interface Votable extends Thing {
    ups: number;
    downs: number;
    likes?: boolean;
}

export interface Created extends Thing {
    created: number;
    created_utc: number;
}

export interface Link extends Votable, Created {
    author?: string;
    author_flair_css_class: string
    author_flair_text: string;
    clicked: boolean;
    domain: string;
    hidden: boolean;
    is_self: boolean;
    likes?: boolean;
    link_flair_css_class: string;
    link_flair_text: string;
    locked: boolean;
    media: any;
    media_embed: any;
    num_comments: number;
    over_18: boolean;
    permalink: string;
    saved: boolean;
    score: number;
    selftext: string;
    selftext_html: string;
    subreddit: string;
    subreddit_id: string;
    thumbnail: string;
    title: string;
    url: string;
    edited: number;
    distinguished: string;
    stickied: boolean;
}

export interface HasLink extends Thing {
    data: Link;
}

export function hasLink(thing: Thing): thing is HasLink {
    return thing.kind == "t3";
}

export interface Listing {
    before: string;
    after: string;
    modhash: string;
    children: Thing[];
}

export interface HasListing extends Thing {
    data: Listing;
}

export function hasListing(thing: Thing): thing is HasListing {
    return thing.kind == "Listing";
}
