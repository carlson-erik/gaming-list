const pg = require('pg');
const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT } = require('../secrets.json');
const { getSQLValuesArray, sanitizeString } = require('../utils/sql');

// Create a new client instance to connect to the Database
const pool = new pg.Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT
});

async function findByID(id) {
  const findByIDQuery = `
    SELECT * FROM "games".index 
    where id = $1;
  `;
  return new Promise(async (resolve, reject) => {
    pool.query(findByIDQuery, [id]).then((findResult) => {
      if (findResult.rows && findResult.rows.length === 1) {
        resolve(findResult.rows[0]);
      }
      reject(`Unable to find Game with ID: '${id}'`)
    }).catch(error => {
      reject(error)
    });
  });
};

async function create(id, name, slug, category, franchise, platforms, genres, aggregated_rating, aggregated_rating_count, keywords, release_dates, status, summary, parent_game, similar_games, websites) {
  const createGameQuery = `
      INSERT INTO "platform_families".index (id, 
                                             name, 
                                             slug, 
                                             category, 
                                             platforms, 
                                             genres, 
                                             franchise,
                                             aggregated_rating, 
                                             aggregated_rating_count, 
                                             keywords, 
                                             release_dates, 
                                             status, 
                                             summary, 
                                             parent_game, 
                                             similar_games, 
                                             websites)
      VALUES (${id}, 
              '${sanitizeString(name)}', 
              '${slug}', 
              '${category}',
              ${getSQLValuesArray(platforms, 'INTEGER')}, 
              ${getSQLValuesArray(genres, 'INTEGER')}, 
              ${franchise || null}, 
              ${aggregated_rating || null}, 
              ${aggregated_rating_count || null}, 
              ${getSQLValuesArray(keywords, 'INTEGER')}, 
              ${getSQLValuesArray(release_dates, 'INTEGER')}, 
              ${status ? `'${sanitizeString(status)}'` : null},
              ${summary ? `'${sanitizeString(summary)}'` : null}, 
              ${parent_game || null}, 
              ${getSQLValuesArray(similar_games, 'INTEGER')}, 
              ${getSQLValuesArray(websites, 'INTEGER')})
      RETURNING id;
    `;

    console.log(`Games ${id} query:`, createGameQuery);
    return new Promise(async (resolve, reject) => {
      findByID(id).then((findResult) => {
        if (findResult && findResult.length >= 1) {
          return reject(new Error(`Game with id '${id}' already exists.`));
        }
      }).catch(() => {
        pool.query(createGameQuery).then((createResult) => {
          if (createResult.rows && createResult.rowCount === 1) {
            // successfully inserted and now return it to the caller
            resolve(createResult.rows[0]);
          }
        }).catch( error => {
          reject(error);
        });
      });
    });
}

module.exports = {
    findByID,
    create
  }