const axios = require('axios');

const dataEndpoints = {
  PLATFORMS: {
    url: "https://api.igdb.com/v4/platforms",
    // data: "fields *; sort id asc; limit 500;",
    // initialMax: 175
    data: "fields *; sort id asc; limit 25;",
    initialMax: 25
  },
  PLATFORM_FAMILIES: {
    url: "https://api.igdb.com/v4/platform_families",
    data: "fields *; sort id asc;",
    initialMax: 5
  },
  GENRES: {
    url: "https://api.igdb.com/v4/genres",
    data: "fields *; sort id asc; limit 100;",
    initialMax: 23
  },
  FRANCHISES: {
    url: "https://api.igdb.com/v4/franchises",
    // data: "fields *; sort id asc;", // limit 500; and offset handling added later
    // initialMax: 2646
    data: "fields *; sort id asc; limit 25;",
    initialMax: 25
  },
  GAMES: {
    url: "https://api.igdb.com/v4/games",
    // data: "fields *; sort id asc;", // limit 500; and offset handling added later
    // initialMax: 156881 // actual initial max
    data: "fields *; sort id asc; limit 25;",
    initialMax: 25 // it's downloading a lot of data with the full amount
  },
  KEYWORDS: {
    url: "https://api.igdb.com/v4/keywords",
    // data: "fields *; sort id asc;", // limit 500; and offset handling added later
    // initialMax: 29491 // actual initial max
    data: "fields *; sort id asc; limit 25;",
    initialMax: 25 // it's downloading a lot of data with the full amount
  },
};


const hydrateDataEndpoints = {
  ARTWORK: {
    url: "https://api.igdb.com/v4/artworks",
    data: "fields *; sort id asc;", // limit 500; and offset handling added later
    // initialMax: 42222,
    initialMax: 25 // it's downloading a lot of data with the full amount
  },
  WEBSITES: {
    url: "https://api.igdb.com/v4/websites",
    data: "fields *; sort id asc;", // limit 500; and offset handling added later
    // initialMax: 183641,
    initialMax: 25 // it's downloading a lot of data with the full amount
  }
};


async function getTwitchToken(clientID, clientSecret) {
  const twitch_GetToken = {
    method: 'POST',
    url: `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`,
    headers: {},
    data: {}
  };
  return new Promise((resolve, reject) => {
    axios.request(twitch_GetToken).then(
      response => {
        resolve({
          token: response.data.access_token,
          expires_in: response.data.expires_in,
        });
      },
      error => {
        console.error(error);
      }).finally(function () {
        reject({
          token: '',
          expires_in: 0
        });
      });
  });
};

async function getSinglePage(config, clientID, token){
  const axiosConfig = {
    ...config, 
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Client-ID': clientID,
    'Authorization': `Bearer ${token}`,
    }
  };
  return new Promise( (resolve, reject) => {
    axios.request(axiosConfig).then(
    ({data}) => {
      resolve(data)
    },
    error => {
      reject(error);
    });
  });
};

async function getAllPages(config, clientID, token, initialMax){
  const allPromises = [];
  const pageSize = 500;
  const delayInMS = 350; // this seems to be the fastest we can poll without error
  const totalPages = Math.floor(initialMax / pageSize) + 1;
  const axiosConfig = {
    ...config, 
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Client-ID': clientID,
    'Authorization': `Bearer ${token}`,
    }
  };

  for (let index = 0; index < totalPages; index += 1) {
    const offset = delayInMS * index;
    const currentOffsetData =  `${config.data} offset ${offset}; limit ${pageSize};`;
    allPromises.push( new Promise(
      async resolve => {
        // the timer/delay
        await new Promise(res => setTimeout(res, offset));

        // the delayed promise
        let result = await getSinglePage({
          ...axiosConfig,
          data: currentOffsetData
        }, clientID, token);

        //resolve outer/original promise with result
        resolve(result);
      }
    ));
  }

   return new Promise( (resolve, reject) => {
    Promise.all(allPromises).then(
    (data) => {
      let allData = [];
      data.forEach(page => {
        allData = [
          ...allData,
          ...page,
        ]
      })
      resolve(allData);
    },
    error => {
      reject(error);
    });
  });
};

module.exports = {
  dataEndpoints,
  hydrateDataEndpoints,
  getTwitchToken,
  getSinglePage,
  getAllPages
}