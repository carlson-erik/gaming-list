const PlatformCategories = {
  1: 'console',
  2: 'arcade',
  3: 'platform',
  4: 'operating_system',
  5: 'portable_console',
  6: 'computer',
};

const GameCategories = {
  0: 'main_game',
  1: 'dlc_addon',
  2: 'expansion',
  3: 'bundle',
  4: 'standalone_expansion',
  5: 'mod',
  6: 'episode',
  7: 'season',
  8: 'remake',
  9: 'remaster',
  10: 'expanded_game',
  11: 'port',
  12: 'fork',
};

// NOTE: No 1 on purpose
const GameStatuses = {
  0: 'released',
  2: 'alpha',
  3: 'beta',
  4: 'early_access',
  5: 'offline',
  6: 'cancelled',
  7: 'rumored'
};

const hydrateEnums = (endpoint, data) => {
  switch(endpoint){
    case 'PLATFORMS':
      return data.map(platform => {
        return {
          ...platform,
          category: PlatformCategories[platform.category]
        }
      });
    case 'GAMES':
      return data.map(game => {
        return {
          ...game,
          category: GameCategories[game.category],
          status: GameStatuses[game.status]
        }
      });
    default:
      return data;
  }
};

module.exports = {
  hydrateEnums
};