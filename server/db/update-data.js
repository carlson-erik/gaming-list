const Franchises = require('../model/franchises');
const Games = require('../model/games');
const Genres = require('../model/genres');
const Platforms = require('../model/platforms');
const PlatformFamilies = require('../model/platform-families');
const Keywords = require('../model/keywords');

function updateData(table, data) {
  // add data to the given table`
  console.log(`[gaming-list] ${table} - updateData:`, data.length);
  switch (table) {
    case 'franchises':
      data.forEach(genreData => {
        const {id, name, slug, games} = genreData;
        Franchises.create(id, name, slug, games).catch(error => {
          console.error(`Franchises ${id} create`, error);
        })
      });
      break;
    case 'games':
      data.forEach(gameData => {
        const {id, name, slug, category, franchise, platforms, genres, aggregated_rating, aggregated_rating_count, keywords, release_dates, status, summary, parent_game, similar_games, websites} = gameData;
        Games.create(id, name, slug, category, franchise, platforms, genres, aggregated_rating, aggregated_rating_count, keywords, release_dates, status, summary, parent_game, similar_games, websites).catch(error => {
          console.error(`Games ${id} create`, error);
        })
      })
      break;
    case 'genres':
      data.forEach(genreData => {
        const {id, name, slug} = genreData;
        Genres.create(id, name, slug).catch(error => {
          console.error(`Genres ${id} create`, error);
        })
      });
      break;
    case 'keywords':
      data.forEach(keywordData => {
        const {id, name, slug} = keywordData;
        Keywords.create(id, name, slug).catch(error => {
          console.error(`Keywords ${id} create`, error);
        })
      });
      break;
    case 'platforms':
      data.forEach(genreData => {
        const {id, category, abbreviation, name, slug, alternative_name, websites} = genreData;
        Platforms.create(id, category, abbreviation, name, slug, alternative_name, websites).catch(error => {
          console.error(`Platforms ${id} create`, error);
        })
      });
      break;
    case 'platform_families':
      data.forEach(genreData => {
        const {id, name, slug} = genreData;
        PlatformFamilies.create(id, name, slug).catch(error => {
          console.error(`PlatformFamilies ${id} create`, error);
        })
      });
      break;
    default: 
      console.error('updateData - Unknown table:', table);
  }
};

module.exports = {
  updateData
}