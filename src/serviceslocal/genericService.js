function getRaceList(year) {
  return import(`../assets/race-${year}.json`).then((module) => {
    return module.raceList;
  });
}

function getScores(year) {
  return import(`../assets/score-${year}.json`).then((module) => {
    return module.teamScores;
  });
}

function getSeasonData(year) {
  return import(`../assets/score-${year}.json`).then((module) => {
    return {
      teamScores: module.teamScores,
      isComplete: module.isComplete,
    };
  });
}

export default {
  getRaceList,
  getScores,
  getSeasonData,
};
