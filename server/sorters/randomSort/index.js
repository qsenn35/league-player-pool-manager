function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const autoFillPlayer = (player, team) => {
  const teamEntries = Object.entries(team);
  
  player.autoFilled = true;

  for (let i = 0; i < teamEntries.length; i++) {
    const [role, value] = teamEntries[i];
    if (!value) {
      team[role] = player;
      break;
    }
  }
}

const fillRoleWithPlayer = (player, team) => {
  const teamEntries = Object.entries(team);
  let roleFilled = false;

  for (let i = 0; i < teamEntries.length; i++) {
    const [role, value] = teamEntries[i];
    

    if (player.primaryRole === "FILL") {
      if (!value) {
        team[role] = player;
        roleFilled = true;
        break;
      }
    }
    
    if (role === player.primaryRole) {
      if (!value) {
        team[role] = player;
        roleFilled = true;
        break;
      }
    }
  
    if (player.secondaryRole === "FILL") {
      if (!value) {
        team[role] = player;
        roleFilled = true;
        break;
      }
    }

    if (role === player.secondaryRole) {
      if (!value) {
        team[role] = player;
        roleFilled = true;
        break;
      }
    }
  }

  if (!roleFilled)
    autoFillPlayer(player, team);
}

const generateRandomTeams = (players) => {
  const teamOne = {
    TOP: null,
    JUNGLE: null,
    MID: null,
    BOT: null,
    SUPPORT: null,
  };

  const teamTwo = {
    TOP: null,
    JUNGLE: null,
    MID: null,
    BOT: null,
    SUPPORT: null,
  };

  const shuffledPlayers = shuffle(players);
  shuffledPlayers.forEach((player) => fillRoleWithPlayer(player, teamOne));
  shuffledPlayers.forEach((player) => fillRoleWithPlayer(player, teamTwo));

  return [
    teamOne,
    teamTwo,
  ];
}

module.exports = { generateRandomTeams }