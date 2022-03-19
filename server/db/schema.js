const tables = [
  'franchises',
  'games',
  'genres',
  'keywords',
  'platforms',
  'platform_families',
];

const DEFAULT_OWNER = 'postgres';

function getSchemaQuery(name, owner=DEFAULT_OWNER){
  return `
CREATE SCHEMA IF NOT EXISTS ${name}
  \t AUTHORIZATION "${owner}";
  `;
};

const franchiseQuery = `
create Table "franchises".index (
  \t id INTEGER NOT NULL,
  \t name TEXT NOT NULL,
  \t slug TEXT NOT NULL,
  \t games INTEGER[] NOT NULL,
  \t PRIMARY KEY (id)
);`;

const gamesQuery = `
create Table "games".index (
  \t id INTEGER NOT NULL,
  \t name TEXT NOT NULL,
  \t slug TEXT NOT NULL,
  \t category TEXT NOT NULL,
  \t platforms INTEGER[] NOT NULL,
  \t genres INTEGER[] NOT NULL,
  \t franchise INTEGER,
  \t aggregated_rating DECIMAL,
  \t aggregated_rating_count INTEGER,
  \t keywords INTEGER[],
  \t parent_game INTEGER,
  \t release_dates INTEGER[],
  \t status TEXT,
  \t storyline TEXT,
  \t summary TEXT,
  \t similar_games INTEGER[],
  \t websites TEXT[],
  \t PRIMARY KEY (id)
);
`;

const genresQuery = `
create Table "genres".index (
  \t id INTEGER NOT NULL,
  \t name TEXT NOT NULL,
  \t slug TEXT NOT NULL,
  \t PRIMARY KEY (id)
);
`;

const keywordsQuery = `
create Table "keywords".index (
  \t id INTEGER NOT NULL,
  \t name TEXT NOT NULL,
  \t slug TEXT NOT NULL,
  \t PRIMARY KEY (id)
);
`;

const platformFamilyQuery = `
create Table "platform_families".index (
  \t id INTEGER NOT NULL,
  \t name TEXT NOT NULL,
  \t slug TEXT NOT NULL,
  \t PRIMARY KEY (id)
);
`;

const platformsQuery = `
create Table "platforms".index (
  \t id INTEGER NOT NULL,
  \t category TEXT NOT NULL,
  \t abbreviation TEXT NOT NULL,
  \t name TEXT NOT NULL,
  \t slug TEXT NOT NULL,
  \t alternative_name TEXT,
  \t websites INTEGER[],
  \t PRIMARY KEY (id)
);
`;

const tableQueries = {
  'franchises': franchiseQuery,
  'games': gamesQuery,
  'genres': genresQuery,
  'keywords': keywordsQuery,
  'platforms': platformFamilyQuery,
  'platform_families': platformsQuery,
};

module.exports = {
  tables,
  tableQueries,
  getSchemaQuery
}