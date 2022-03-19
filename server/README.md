# gaming-list-server

## Set-Up
In order to run this server, you need to add a ```secrets.json``` at the same level as ```index.js```.

The contents have to be:
```json
{
    "clientID": "TWITCH_CLIENT_ID",
    "clientSecret": "TWITCH_CLIENT_SECRET",
    "DB_USER": "gl-admin",
    "DB_HOST": "localhost",
    "DB_DATABASE": "gaming-list",
    "DB_PASSWORD": "gaming-list",
    "DB_PORT": 5432
}
```

After this, you need to be running a postgres server with a Database and User created.

## Running Server

Assuming you've followed the Set-up instructions, you can run the server using the following command:

```
npm run start
```