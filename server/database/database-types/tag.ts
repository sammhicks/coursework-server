interface Tag {
    video_id: string;
}

export interface CountryTag extends Tag {
    country_id: number;
}

export interface CompetitionTag extends Tag {
    competition_id: number;
}

export interface TeamTag extends Tag {
    team_id: number;
}

export interface PlayerTag extends Tag {
    player_id: number;
}
