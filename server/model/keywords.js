const pg = require('pg');
const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT } = require('../secrets.json');
const { sanitizeString } = require('../utils/sql');

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
    SELECT * FROM "keywords".index 
    where id = $1;
  `;
    return new Promise(async (resolve, reject) => {
      pool.query(findByIDQuery, [id]).then((findResult) => {
        if (findResult.rows && findResult.rows.length === 1) {
          resolve(findResult.rows[0]);
        }
        reject(`Unable to find Keyword with ID: '${id}'`)
      }).catch(error => {
        reject(error)
      });
    });
  };
  
  async function create(id, name, slug) {
    const createKeywordQuery = `
      INSERT INTO "keywords".index (id, name, slug)
      VALUES ('${id}', '${sanitizeString(name)}', '${slug}')
      RETURNING id;
    `;
    return new Promise(async (resolve, reject) => {
      findByID(id).then((findResult) => {
        if (findResult && findResult.length >= 1) {
          return reject(new Error(`Keyword with id '${id}' already exists.`));
        }
      }).catch(() => {
        pool.query(createKeywordQuery).then((createResult) => {
          if (createResult.rows && createResult.rowCount === 1) {
            // successfully inserted and now return it to the caller
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