const {
  BRONZE,
  SILVER,
  GOLD,
  PLATINUM,
  DIAMOND,
  MASTERS,
  GRANDMASTERS,
  CHALLENGER,
  TOP, 
  JUNGLE, 
  MID, 
  BOT, 
  SUPPORT
} = require('./constants.js');


exports.getRandomRole = () => {
  const roles = [TOP, JUNGLE, MID, BOT, SUPPORT];

  return roles[Math.floor(Math.random() * roles.length)];
};

exports.getRandomSecondaryRole = (primaryRole) => {
  let secondaryRole = primaryRole;
  while (secondaryRole === primaryRole) {
    secondaryRole = exports.getRandomRole();
  }

  return secondaryRole;
};

exports.getRandomRank = () => {
  const ranks = [
    BRONZE,
    SILVER,
    GOLD,
    PLATINUM,
    DIAMOND,
    MASTERS,
    GRANDMASTERS,
    CHALLENGER,
  ];

  return ranks[Math.floor(Math.random() * ranks.length)];
};

exports.createRandomPlayers = (amount) => {
  const players = [];

  for (let i = 0; i < amount; i++) {
    const primaryRole = exports.getRandomRole();
    let player = {
      name: `example ${i}`,
      rank: exports.getRandomRank(),
      primaryRole: primaryRole,
      secondaryRole: exports.getRandomSecondaryRole(primaryRole),
    };
    players.push(player);
  }

  return players;
};

exports.makeTeamObjects = (amount) => {
  let teams = [];
  for (let i = 0; i < amount; i++) {
    teams.push({
      TOP: null,
      JUNGLE: null,
      MID: null,
      BOT: null,
      SUPPORT: null,
    })
  }

  return teams;
}

exports.prettyPrintTeam = (team) => {
  let print = "";
  Object.entries(team)
    .forEach(([role, player]) => {
      print += role;
      if (player)
        print += `: [${player.name}] ${player.rank} ${player.primaryRole} ${player.secondaryRole}\n`;
      else
        print += `: NULL NULL\n`;
    })
  return print;
}

exports.prettyPrintPlayer = (player) => {
  return `[${player.name}] ${player.rank} ${player.primaryRole} ${player.secondaryRole}`;
}