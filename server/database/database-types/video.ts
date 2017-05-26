export interface Video {
    id: string;
    title: string;
    url: string;
    domain: string;
    date: number;
    country_tags?: string[];
    competition_tags?: string[];
    team_tags?: string[];
    player_tags?: string[];
}
