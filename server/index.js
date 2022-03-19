const fs = require('fs');
const db = require('./db');
const { updateData } = require('./db/update-data');
const { hydrateEnums } = require('./data/hydrate');
const { dataEndpoints, getTwitchToken, getSinglePage, getAllPages } = require('./data/fetch');
const { clientID, clientSecret } = require('./secrets.json');

const dataFolder = './static-data'

async function getGameData(writeToFile) {
  return new Promise( async (resolve, reject) => {
    const allEndpoints = Object.keys(dataEndpoints);

    // Get Twitch access token so we can access IGDB
    const { token } = await getTwitchToken( clientID, clientSecret );

    // Create data folder if we're writing to 
    if (writeToFile && !fs.existsSync(dataFolder)){
      fs.mkdirSync(dataFolder);
    }

    // Get all the data for each endpoint
    const dataPromises = allEndpoints.map( endpoint => {
      const epConfig = dataEndpoints[endpoint];
      if(epConfig.initialMax <= 500){
        return getSinglePage(epConfig, clientID, token);
      } else {
        return getAllPages(epConfig, clientID, token, epConfig.initialMax);
      }
    });

    Promise.all(dataPromises).then( data => {
      data.forEach( (dataSet, index) => {
        const currentEndPoint = allEndpoints[index];
        const updatedData = hydrateEnums(currentEndPoint, dataSet);
        if(writeToFile){
          const stringifiedData = JSON.stringify(updatedData);
          fs.writeFileSync(`${dataFolder}/${currentEndPoint.toLowerCase()}.json`, stringifiedData);
        }
        updateData(currentEndPoint.toLowerCase(), updatedData);
      })
    }).catch(e => {
      console.error(e);
      reject(e)
    }).finally(() => {
      resolve("all files written");
    })
  })
}

async function main() {
  const { success, error } = await db.initializeDatabase();

  if(!success) {
    console.error('[gaming-list] Could not initialize db:', error);
  }

  await getGameData(true);
}

main();