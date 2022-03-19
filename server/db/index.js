const pg = require('pg');
const { tables, tableQueries, getSchemaQuery } = require('./schema');
const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT } = require('../secrets.json');

// All Schema related error codes 
const schemaCodes = {
  "25007": "schema_and_data_statement_mixing_not_supported",
  "3F000": "invalid_schema_name",
  "42P06": "duplicate_schema",
  "42P15": "invalid_schema_definition",
  "42000": "syntax_error_or_access_rule_violation",
  "42601": "syntax_error"
};

// Create a new client instance to connect to the Database
const pool = new pg.Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT
});

const nukeOnReload = true;
const allSchemasQuery = `SELECT * FROM information_schema.schemata;`;

async function initializeDatabase() {
  if(nukeOnReload){
    await nukeDB();
  }
  return new Promise(async (resolve,reject) => {
    pool.query(allSchemasQuery).then(
      res => {
        let existingSchemas = [];
        if(res && res.rows){
          res.rows.forEach(row => {
            existingSchemas.push(row.schema_name);
          });
        }
        const nonExistingSchemas = tables.filter(table => !existingSchemas.includes(table));
        console.log('[gaming-list] Existing Schemas:', tables.filter(table => !nonExistingSchemas.includes(table)));

        const schemaPromises = nonExistingSchemas.map(async schemaName => {
          return pool.query(getSchemaQuery(schemaName, DB_USER));
        });

        // Create all missing Schemas in DB
        Promise.all(schemaPromises).then(() => {
          // Create tables for all created Schemas
          const tablePromises = nonExistingSchemas.map(async schemaName => pool.query(tableQueries[schemaName]));
          Promise.all(tablePromises).then(() => {
            console.log('[gaming-list] Initialized Schemas & Tables for:', nonExistingSchemas);
            resolve({
              success: true,
            })
          }).catch(
            err => {
              reject({
                success: false,
                error: err.code
              })
            });
        })
        .catch(
          err => {
            reject({
              success: false,
              error: err.code
            })
          })
      }
    ).catch(
      err => {
        console.error("[gaming-list] ERROR code:", err.code);
        reject({
          success: false,
          error: err.code
        });
      }
    )
  });
}

/** Using the list of schemas, drop all schemas/tables associated with gaming-list */
function nukeDB() {
  return new Promise( (resolve, reject) => {
    pool.query(allSchemasQuery).then(
      res => {
        let existingSchemas = [];
        if(res && res.rows){
          res.rows.forEach(row => {
            if(tables.includes(row.schema_name)) {
              existingSchemas.push(row.schema_name);
            }
          });
          console.log('[gaming-list] Dropping the following: ', existingSchemas);
        }
        const allPromises = [];
        existingSchemas.forEach(schema => {
          const deleteQuery = `DROP SCHEMA ${schema} CASCADE;`;
          allPromises.push(
            pool.query(deleteQuery)
          )
        })
        Promise.all(allPromises).then(
          () => resolve('all tables dropped')
        ).catch(
          (error) => reject(`[gaming-list] ERROR dropping schemas: ${error}`)
        );
      }
    ).catch(
      err => {
        console.error("[gaming-list] ERROR code:", err.code);
        reject({
          success: false,
          error: err.code
        });
      }
    )
  })
}

module.exports = {
 initializeDatabase
};