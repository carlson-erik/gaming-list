import React, { useEffect, useState } from 'react';
import axios, {AxiosRequestConfig, AxiosError, AxiosResponse} from 'axios';

const clientID: string = 'ID';
const clientSecret: string = 'SECRET';

const twitch_GetToken:AxiosRequestConfig  = {
  method: 'POST',
  url: `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`,
  headers: {},
  data: {}
};

type AccessToken = {
  token: string,
  expires_in: number,
};

function getTwitchToken(): Promise<AccessToken> {
  return new Promise<AccessToken>( (resolve, reject) => {
    axios.request(twitch_GetToken).then(
    function (response: AxiosResponse) {
      resolve({
        token: response.data.access_token,
        expires_in: response.data.expires_in,
      });
    },
    function(error: Error | AxiosError) {
      console.error(error);
    }).finally( function () {
      reject({
        token: '',
        expires_in: 0
      });
    });
  });
};

function getPlatforms(access_token: string): Promise<any> {
  console.log('fetching using:', access_token);
  const igdb_GetPlatform:AxiosRequestConfig = {
    method: 'POST',
    url: 'https://api.igdb.com/v4/platforms',
    headers: {
      'Client-ID': clientID,
      'Authorization': `Bearer ${access_token}`,
    },
    data: {},
  };
  return new Promise<any>( (resolve, reject) => {
    axios.request(igdb_GetPlatform).then(
      function (response:AxiosResponse) {
        console.log('response:', response)
        resolve(response);
      },
      function(error: Error | AxiosError) {
        console.error(error);
      }
    )
  })
}

function App() {
  const [access, setAccess] = useState<AccessToken | null>(null);

  useEffect( () => {
    // get and store twitch access token
    getTwitchToken().then((accessToken) => setAccess(accessToken))
  }, []);

  useEffect( () => {
    if(access) {
      getPlatforms(access.token).then( (data: any) => {
        console.log('testing:', data);
      })
    }
  }, [access])
  return (
    <div>
      gaming list app
      {access && access.token !== '' ? (
        <React.Fragment>
          <div>
            access token: {access.token}
          </div>
          <div>
            expires in: {access.expires_in}
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
}

export default App;
