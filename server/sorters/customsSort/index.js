const TOP = "TOP";
const JUNGLE = "JUNGLE";
const MID = "MID";
const BOT = "BOT";
const SUPPORT = "SUPPORT";
const FILL = "FILL";

const RANK_VALUES = {
  IRON: 1,
  BRONZE: 2,
  SILVER: 3,
  GOLD: 4,
  PLATINUM: 5,
  DIAMOND: 6,
  MASTERS: 7,
  GRANDMASTERS: 8,
  CHALLENGER: 9,
};

const assignPlayerRankValues = (players) => {
  return players.map((player) => {
    player.rankValue = RANK_VALUES[player.rank];
    return player;
  });
};

const sortPlayersByRankValue = (players) => {
  return players.sort((a, b) => {
    return a.rankValue - b.rankValue;
  });
};

const seperatePlayersByRole = (players) => {
  let topPlayers = [];
  let junglePlayers = [];
  let midPlayers = [];
  let botPlayers = [];
  let supportPlayers = [];
  let fillPlayers = [];

  let topSecondaryPlayers = [];
  let jungleSecondaryPlayers = [];
  let midSecondaryPlayers = [];
  let botSecondaryPlayers = [];
  let supportSecondaryPlayers = [];

  players.forEach((player) => {
    switch (player.primaryRole) {
      case TOP:
        topPlayers.push(player);
        break;
      case JUNGLE:
        junglePlayers.push(player);
        break;
      case MID:
        midPlayers.push(player);
        break;
      case BOT:
        botPlayers.push(player);
        break;
      case SUPPORT:
        supportPlayers.push(player);
        break;
      case FILL:
        fillPlayers.push(player);
        break;
    }
    switch (player.secondaryRole) {
      case TOP:
        topSecondaryPlayers.push(player);
        break;
      case JUNGLE:
        jungleSecondaryPlayers.push(player);
        break;
      case MID:
        midSecondaryPlayers.push(player);
        break;
      case BOT:
        botSecondaryPlayers.push(player);
        break;
      case SUPPORT:
        supportSecondaryPlayers.push(player);
        break;
    }
  });

  return {
    topPlayers,
    junglePlayers,
    midPlayers,
    botPlayers,
    supportPlayers,
    fillPlayers,
    topSecondaryPlayers,
    jungleSecondaryPlayers,
    midSecondaryPlayers,
    botSecondaryPlayers,
    supportSecondaryPlayers,
  };
};

const rollForRole = (rolePlayers) => {
  let diceRolls = [];

  diceRolls = rolePlayers.map((player) => {
    return {
      player,
      roll: Math.random(),
    };
  });

  diceRolls = diceRolls.sort((a, b) => {
    return a.roll - b.roll;
  });

  const finalPlayers = {
    chosen: [],
    notChosen: [],
  };

  diceRolls.forEach((roll, index) => {
    if (index <= 1) {
      finalPlayers.chosen.push(roll.player);
    } else {
      finalPlayers.notChosen.push(roll.player);
    }
  });

  return finalPlayers;
};

const fillTeamSlotsByRole = (chosenPlayers, notChosenPlayers, fillPlayers) => {
  let teamOne = {
    TOP: null,
    JUNGLE: null,
    MID: null,
    BOT: null,
    SUPPORT: null,
  };

  let teamTwo = {
    TOP: null,
    JUNGLE: null,
    MID: null,
    BOT: null,
    SUPPORT: null,
  };
  // handle chosen players for primary role
  chosenPlayers.forEach((player) => {
    switch (player.primaryRole) {
      case TOP:
        if (!teamOne.TOP) teamOne.TOP = player;
        else teamTwo.TOP = player;
        break;
      case JUNGLE:
        if (!teamOne.JUNGLE) teamOne.JUNGLE = player;
        else teamTwo.JUNGLE = player;
        break;
      case MID:
        if (!teamOne.MID) teamOne.MID = player;
        else teamTwo.MID = player;
        break;
      case BOT:
        if (!teamOne.BOT) teamOne.BOT = player;
        else teamTwo.BOT = player;
        break;
      case SUPPORT:
        if (!teamOne.SUPPORT) teamOne.SUPPORT = player;
        else teamTwo.SUPPORT = player;
        break;
    }
  });

  // handle secondary roles
  notChosenPlayers.forEach((player) => {
    switch (player.secondaryRole) {
      case TOP:
        if (!teamOne.TOP) teamOne.TOP = player;
        else if (!teamTwo.TOP) teamTwo.TOP = player;
        // auto fill player
        else fillPlayers.push(player);
        break;
      case JUNGLE:
        if (!teamOne.JUNGLE) teamOne.JUNGLE = player;
        else if (!teamTwo.JUNGLE) teamTwo.JUNGLE = player;
        // auto fill player
        else fillPlayers.push(player);
        break;
      case MID:
        if (!teamOne.MID) teamOne.MID = player;
        else if (!teamTwo.MID) teamTwo.MID = player;
        // auto fill player
        else fillPlayers.push(player);
        break;
      case BOT:
        if (!teamOne.BOT) teamOne.BOT = player;
        else if (!teamTwo.BOT) teamTwo.BOT = player;
        // auto fill player
        else fillPlayers.push(player);
        break;
      case SUPPORT:
        if (!teamOne.SUPPORT) teamOne.SUPPORT = player;
        else if (!teamTwo.SUPPORT) teamTwo.SUPPORT = player;
        // auto fill player
        else fillPlayers.push(player);
        break;
    }
  });

  // handle fill players
  Object.entries(teamOne).forEach(([role, value], index) => {
    if (!value) teamOne[role] = fillPlayers.shift();
  });

  Object.entries(teamTwo).forEach(([role, value]) => {
    if (!value) teamTwo[role] = fillPlayers.shift();
  });

  return {
    teamOne,
    teamTwo,
  };
};

const generateTeamsByRole = (players) => {
  let {
    topPlayers,
    junglePlayers,
    midPlayers,
    botPlayers,
    supportPlayers,
    fillPlayers,
  } = seperatePlayersByRole(players);

  let chosenTopPlayers = rollForRole(topPlayers);
  let chosenJunglePlayers = rollForRole(junglePlayers);
  let chosenMidPlayers = rollForRole(midPlayers);
  let chosenBotPlayers = rollForRole(botPlayers);
  let chosenSupportPlayers = rollForRole(supportPlayers);

  let chosenPlayers = [
    ...chosenTopPlayers.chosen,
    ...chosenJunglePlayers.chosen,
    ...chosenMidPlayers.chosen,
    ...chosenBotPlayers.chosen,
    ...chosenSupportPlayers.chosen,
  ];

  let notChosenPlayers = [
    ...chosenTopPlayers.notChosen,
    ...chosenJunglePlayers.notChosen,
    ...chosenMidPlayers.notChosen,
    ...chosenBotPlayers.notChosen,
    ...chosenSupportPlayers.notChosen,
  ];

  const { teamOne, teamTwo } = fillTeamSlotsByRole(
    chosenPlayers,
    notChosenPlayers,
    fillPlayers
  );

  return {
    teamOne,
    teamTwo,
  };
};

const calcTeamValue = (team) => {
  return Object.values(team).reduce((teamValue, player) => {
    if (!player) return teamValue;
    return teamValue + player.rankValue;
  }, 0);
};

const teamToPlayerArray = (team) => {
  return Object.entries(team).map(([role, player]) => {
    if (player)
      player.assignedRole = role;
    return player;
  });
};

const findNextLowEloByRole = (team, players) => {
  for (let j = 0; j < players.length; j++) {
    let p = players[j];
    if (!team[p.assignedRole]) {
      players.splice(j, 1);
      return p;
    }
  }
};

const findNextHighEloByRole = (team, players) => {
  for (let j = players.length - 1; j >= 0; j--) {
    let p = players[j];
    if (!team[p.assignedRole]) {
      players.splice(j, 1);
      return p;
    }
  }
};

const balanceTeamsByRank = (teamOne, teamTwo) => {
  let balancedTeamOne = {
    TOP: null,
    JUNGLE: null,
    MID: null,
    BOT: null,
    SUPPORT: null,
  };
  let balancedTeamTwo = {
    TOP: null,
    JUNGLE: null,
    MID: null,
    BOT: null,
    SUPPORT: null,
  };

  const teamOnePlayers = teamToPlayerArray(teamOne);
  const teamTwoPlayers = teamToPlayerArray(teamTwo);
  const mergedPlayers = [...teamOnePlayers, ...teamTwoPlayers];

  let teamOneValue = 0;
  let teamTwoValue = 0;
  let clonedMergedPlayers = [...mergedPlayers].sort(
    (a, b) => a.rankValue - b.rankValue
  );
  let teamAlternator = 1;
  let i = 0;
  while (clonedMergedPlayers.length && i < 10) {
    // to avoid infinite loops when testing

    let player = null;
    teamOneValue = calcTeamValue(balancedTeamOne);
    teamTwoValue = calcTeamValue(balancedTeamTwo);

    if (teamAlternator === 1) {
      if (teamOneValue > teamTwoValue) {
        player = findNextLowEloByRole(balancedTeamOne, clonedMergedPlayers);
      } else if (teamOneValue < teamTwoValue) {
        player = findNextHighEloByRole(balancedTeamOne, clonedMergedPlayers);
      } else {
        player = findNextLowEloByRole(balancedTeamOne, clonedMergedPlayers);
      }

      if (player) balancedTeamOne[player.assignedRole] = player;
    } else {
      if (teamOneValue > teamTwoValue) {
        player = findNextHighEloByRole(balancedTeamTwo, clonedMergedPlayers);
      } else if (teamOneValue < teamTwoValue) {
        player = findNextLowEloByRole(balancedTeamTwo, clonedMergedPlayers);
      } else {
        player = findNextLowEloByRole(balancedTeamTwo, clonedMergedPlayers);
      }
      
      if (player) balancedTeamTwo[player.assignedRole] = player;
    }
    if (teamAlternator === 1) teamAlternator = 2;
    else teamAlternator = 1;

    i++;
  }

    balancedTeamOne.teamValue = calcTeamValue(balancedTeamOne);
    balancedTeamTwo.teamValue = calcTeamValue(balancedTeamTwo);

    return {
      balancedTeamOne,
      balancedTeamTwo,
    };
};

const generateCustomsTeams = (playerPool) => {
  playerPool = assignPlayerRankValues(playerPool);
  playerPool = sortPlayersByRankValue(playerPool);
  const { teamOne, teamTwo } = generateTeamsByRole(playerPool);
  const { balancedTeamOne, balancedTeamTwo } = balanceTeamsByRank(
    teamOne,
    teamTwo
  );

  return [balancedTeamOne, balancedTeamTwo];
}

module.exports = {
  generateCustomsTeams
}