// import json from '../assets/race-2020.json'

function getRaceList (year) {
  let json = require(`../assets/race-${year}.json`)
  return new Promise((resolve) => {
    resolve(json.raceList)
  })
}

function getScores (year) {
  let json = require(`../assets/score-${year}.json`)
  return new Promise((resolve) => {
    resolve(json.teamScores)
  })
}

export default {
  getRaceList,
  getScores
}
