const {
  makeTeamObjects,
  prettyPrintTeam,
  prettyPrintPlayer,
} = require("./util.js");
const { GOLD, DIAMOND, RANK_VALUES } = require("./constants.js");

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

const seperateByHighAndLowElo = (players) => {
  const sortedPlayers = sortPlayersByRankValue(players);

  const midEloThreshold = RANK_VALUES[GOLD];
  const highEloThreshold = RANK_VALUES[DIAMOND];

  const lowElo = [];
  const midElo = [];
  const highElo = [];

  for (let i = 0; i < sortedPlayers.length; i++) {
    let player = sortedPlayers[i];
    if (player.rankValue < midEloThreshold) lowElo.push(player);
    else if (player.rankValue < highEloThreshold) {
      if (lowElo.length % 5 === 0) midElo.push(player);
      else {
        lowElo.push(player);
      }
    } else {
      if (midElo.length % 5 === 0) highElo.push(player);
      else {
        midElo.push(player);
      }
    }
  }

  return {
    lowElo,
    midElo,
    highElo,
  };
};

const seperateByRole = (players) => {
  const teamCount = Math.ceil(players.length / 5);
  const teams = makeTeamObjects(teamCount);
  const leftOvers = [];
  const clonedPlayers = [...players];

  for (let i = 0; i < clonedPlayers.length; i++) {
    const player = clonedPlayers[i];
    let foundTeamSpot = false;
    for (let j = 0; j < teams.length; j++) {
      if (!teams[j][player.primaryRole]) {
        teams[j][player.primaryRole] = player;
        foundTeamSpot = true;
        break;
      }
    }

    if (!foundTeamSpot) {
      for (let k = 0; k < teams.length; k++) {
        if (!teams[k][player.secondaryRole]) {
          teams[k][player.secondaryRole] = player;
          foundTeamSpot = true;
          break;
        }
      }
    }

    if (!foundTeamSpot) {
      leftOvers.push(player);
    }
  }

  return [teams, leftOvers];
};

const autoFillPlayers = (teams, players) => {
  for (let i = 0; i < teams.length; i++) {
    const teamEntries = Object.entries(teams[i]);

    for (let j = 0; j < teamEntries.length; j++) {
      const [role, value] = teamEntries[j];
      if (!value) {
        teams[i][role] = players.shift();
      }
    }
  }
  return [teams, players];
};

const generateBootcampTeams = (players) => {
  const rankValuePlayers = assignPlayerRankValues(players);
  const { lowElo, midElo, highElo } = seperateByHighAndLowElo(rankValuePlayers);
  const [lowEloTeams, lowEloLeftOvers] = seperateByRole(lowElo);
  const [lowEloTeamsAutoFilled, lowEloAutoFillLeftOvers] = autoFillPlayers(
    lowEloTeams,
    lowEloLeftOvers
  );
  const [midEloTeams, midEloLeftOvers] = seperateByRole(midElo);
  const [midEloTeamsAutoFilled, midEloAutoFillLeftOvers] = autoFillPlayers(
    midEloTeams,
    midEloLeftOvers
  );
  const [highEloTeams, highEloLeftOvers] = seperateByRole(highElo);
  const [highEloTeamsAutoFilled, highEloAutoFillLeftOvers] = autoFillPlayers(
    highEloTeams,
    highEloLeftOvers
  );

  console.log("::: Starting Players :::");
  console.log("::: Low ELO Players :::");
  lowElo.forEach((player) => console.log(prettyPrintPlayer(player)));
  console.log("\n::: Mid ELO Players :::");
  midElo.forEach((player) => console.log(prettyPrintPlayer(player)));
  console.log("\n::: High ELO Players :::");
  highElo.forEach((player) => console.log(prettyPrintPlayer(player)));

  console.log("\n::: Final Teams :::");
  console.log("::: Low ELO Teams :::");
  lowEloTeamsAutoFilled.forEach((team) => console.log(prettyPrintTeam(team)));
  console.log("::: Mid ELO Teams :::");
  midEloTeamsAutoFilled.forEach((team) => console.log(prettyPrintTeam(team)));
  console.log("::: High ELO Teams :::");
  highEloTeamsAutoFilled.forEach((team) => console.log(prettyPrintTeam(team)));

  console.log("\n::: Leftover Players :::");
  console.log("::: Low ELO Leftover Players :::");
  lowEloAutoFillLeftOvers.forEach((player) =>
    console.log(prettyPrintPlayer(player))
  );
  console.log("\n::: Mid ELO Leftover Players :::");
  midEloAutoFillLeftOvers.forEach((player) =>
    console.log(prettyPrintPlayer(player))
  );
  console.log("\n::: High ELO Leftover Players :::");
  highEloAutoFillLeftOvers.forEach((player) =>
    console.log(prettyPrintPlayer(player))
  );

  console.log(rankValuePlayers.length);
  console.log(lowElo.length, midElo.length, highElo.length);
  console.log(
    lowEloTeamsAutoFilled.length,
    midEloTeamsAutoFilled.length,
    highEloTeamsAutoFilled.length
  );
  console.log(
    lowEloAutoFillLeftOvers.length,
    midEloAutoFillLeftOvers.length,
    highEloAutoFillLeftOvers.length
  );

  return [lowEloTeamsAutoFilled, midEloTeamsAutoFilled, highEloTeamsAutoFilled];
};

exports.generateBootcampTeams = generateBootcampTeams;
