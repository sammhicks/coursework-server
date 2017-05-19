CREATE TABLE "sources" (
    "id"        INTEGER PRIMARY KEY,
    "domain"    TEXT
);

INSERT INTO "sources" ("domain") VALUES ("my.mixtape.moe");
INSERT INTO "sources" ("domain") VALUES ("streamable.com");

CREATE TABLE "videos" (
    "id"            INTEGER PRIMARY KEY,
    "source_id"     INTEGER,
    "reddit_id"     TEXT UNIQUE,
    "title"         TEXT,
    "url"           TEXT,
    FOREIGN KEY("source_id") REFERENCES "sources"("id")
);
