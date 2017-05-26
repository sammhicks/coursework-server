export interface Video {
    id: number;
    source_id: number;
    date: number;
    title: string;
    url: string;
    country_tags?: string[];
    competition_tags?: string[];
    team_tags?: string[];
    player_tags?: string[];
}
