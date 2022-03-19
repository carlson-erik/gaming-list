# Gaming List Data

## Common Term Breakdown
1 page = 500 records

## Leveragble Data

This is data that I have access to that the user might to make "owned" lists out of:

1. Platforms (175 records, 1 page)
    - End Point: ```https://api.igdb.com/v4/platforms```
2. Video Games 
    - End Point: ```https://api.igdb.com/v4/games```

## Filterable Fields

This is data that I have access to that the user might to filter all :

1. Platform 
    - End Point: ```https://api.igdb.com/v4/platforms```
    - Component: Searchable Combobox
2. Platform Family 
    - End Point: ```https://api.igdb.com/v4/platform_families```
    - Component: Dropdown
3. Genre
    - End Point: ```https://api.igdb.com/v4/genres```
    - Component: Searchable Combobox
4. Franchise 
    - End Point: ```https://api.igdb.com/v4/franchises```
    - Component: Searchable Combobox (probs lazy loaded)

## Tech Stack Inforamtion
* Nodejs
* axios (to fetch data)

## Data Fetching Process

Fetch data in the following order:
1. Platforms (175 records, 1 page)
2. Platform Families (5 records, 1 page)
3. Genres (23 records, 1 page)
4. Franchises (~2646 records, 6 pages)
5. Games (156881 records, 314 pages)

Below is the process in which we will fetch, and store the IGDB data.

1. Get Twitch Access Token and store locally using my Client Id
2. Iterate over the logical data groupings mentioned above, and for each:
    * Fetch all pages for a given endpoint (listed above)
    * Write to DB
3. Hydrate fields that I don't want to store individually that is by IGDB
4. Finishing steps that do clean-up, etc