-- Football Data

CREATE TABLE "countries" (
    "id"        INTEGER PRIMARY KEY,
    "shortcode" TEXT,
    "name"      TEXT
);

INSERT INTO "countries" ("shortcode", "name") VALUES ("ENG", "England");
INSERT INTO "countries" ("shortcode", "name") VALUES ("ESP", "Spain");
INSERT INTO "countries" ("shortcode", "name") VALUES ("FRA", "France");
INSERT INTO "countries" ("shortcode", "name") VALUES ("DEU", "Germany");
INSERT INTO "countries" ("shortcode", "name") VALUES ("ITA", "Italy");
INSERT INTO "countries" ("shortcode", "name") VALUES ("NLD", "Netherlands");
INSERT INTO "countries" ("shortcode", "name") VALUES ("PRT", "Portugal");

CREATE TABLE "competitions" (
    "id"            INTEGER PRIMARY KEY,
    "name"          TEXT,
    "country_id"    INTEGER,
    FOREIGN KEY ("country_id") REFERENCES "countries"("id")
);

INSERT INTO "competitions" VALUES (426, "Premier League", (SELECT id from countries where shortcode = "ENG"));
INSERT INTO "competitions" VALUES (427, "Championship", (SELECT id from countries where shortcode = "ENG"));
INSERT INTO "competitions" VALUES (430, "1. Bundesliga", (SELECT id from countries where shortcode = "DEU"));
INSERT INTO "competitions" VALUES (431, "2. Bundesliga", (SELECT id from countries where shortcode = "DEU"));
INSERT INTO "competitions" VALUES (433, "Eredivisie", (SELECT id from countries where shortcode = "NLD"));
INSERT INTO "competitions" VALUES (434, "Ligue 1", (SELECT id from countries where shortcode = "FRA"));
INSERT INTO "competitions" VALUES (436, "Primera Division", (SELECT id from countries where shortcode = "ESP"));
INSERT INTO "competitions" VALUES (438, "Serie A", (SELECT id from countries where shortcode = "ITA"));
INSERT INTO "competitions" VALUES (439, "Primeira Liga", (SELECT id from countries where shortcode = "PRT"));

CREATE TABLE "teams" (
    "id"                INTEGER PRIMARY KEY,
    "name"              TEXT,
    "short_name"        TEXT,
    "crest_url"         TEXT,
    "competition_id"    INTEGER,
    FOREIGN KEY ("competition_id") REFERENCES "competitions"("id")
);

CREATE TABLE "players" (
    "id"                INTEGER PRIMARY KEY,
    "name"              TEXT,
    "team_id"           INTEGER,
    FOREIGN KEY ("team_id") REFERENCES "teams"("id")
);


CREATE TABLE "fixtures" (
    "date"              INTEGER,
    "home_team_id"      INTEGER,
    "away_team_id"      INTEGER,
    "competition_id"    INTEGER,
    FOREIGN KEY ("home_team_id") REFERENCES "teams"("id"),
    FOREIGN KEY ("away_team_id") REFERENCES "teams"("id"),
    FOREIGN KEY ("competition_id") REFERENCES "competitions"("id")
);

CREATE INDEX "fixture_dates" ON "fixtures" ("date");

-- Videos

CREATE TABLE "sources" (
    "id"        INTEGER PRIMARY KEY,
    "domain"    TEXT
);

INSERT INTO "sources" ("domain") VALUES ("my.mixtape.moe");
INSERT INTO "sources" ("domain") VALUES ("streamable.com");

CREATE TABLE "videos" (
    "id"            TEXT PRIMARY KEY UNIQUE,
    "source_id"     INTEGER,
    "date"          INTEGER,
    "title"         TEXT,
    "url"           TEXT,
    FOREIGN KEY ("source_id") REFERENCES "sources"("id")
);

-- Video Tags

CREATE TABLE "team_tags" (
    "video_id"      TEXT,
    "team_id"       INTEGER,
    FOREIGN KEY ("video_id") REFERENCES "videos"("id"),
    FOREIGN KEY ("team_id") REFERENCES "teams"("id")
);

CREATE INDEX "team_tag_videos" ON "team_tags" ("video_id");

CREATE TABLE "player_tags" (
    "video_id"      TEXT,
    "player_id"     INTEGER,
    FOREIGN KEY ("video_id") REFERENCES "videos"("id"),
    FOREIGN KEY ("player_id") REFERENCES "players"("id")
);

CREATE INDEX "player_tag_videos" ON "player_tags" ("video_id");
