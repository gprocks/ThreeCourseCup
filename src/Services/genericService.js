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

export default {
  getRaceList,
  getScores,
};
