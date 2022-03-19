const pg = require('pg');
const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT } = require('../secrets.json');
const { getSQLValuesArray } = require('../utils/sql');

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
  SELECT * FROM "platforms".index 
  where id = $1;
`;
  return new Promise(async (resolve, reject) => {
    pool.query(findByIDQuery, [id]).then((findResult) => {
      if (findResult.rows && findResult.rows.length === 1) {
        resolve(findResult.rows[0]);
      }
      reject(`Unable to find Platform with ID: '${id}'`)
    }).catch(error => {
      reject(error)
    });
  });
};

async function create(id, category, abbreviation, name, slug, alternative_name, websites) {
  const createPlatformQuery = `
    INSERT INTO "platforms".index (id, category, abbreviation, name, slug, alternative_name, websites)
    VALUES ('${id}', '${category}', '${abbreviation}', '${name}', '${slug}', ${alternative_name ? `'${alternative_name}'`: null}, '${getSQLValuesArray(websites, 'INTEGER')}')
    RETURNING id;
  `;
  return new Promise(async (resolve, reject) => {
    findByID(id).then((findResult) => {
      if (findResult && findResult.length >= 1) {
        return reject(new Error(`Platform with id '${id}' already exists.`));
      }
    }).catch(() => {
      pool.query(createPlatformQuery).then((createResult) => {
        if (createResult.rows && createResult.rowCount === 1) {
          // successfully created the data and now return to the caller
          resolve(createResult.rows[0]);
        }
      }).catch( error => {
        reject(error);
      });
    });
  });
};

module.exports = {
  findByID,
  create
}