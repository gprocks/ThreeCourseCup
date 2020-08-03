<template>
  <div id="app">
    <LineChart :team-scores="teamScores" :race-names="raceNamesWithData"/>
    <BarChart :team-scores="teamScores" :race-names="raceNamesWithData"/>
    <PlayerDetails :team-scores="teamScores" :race-names="raceNamesWithData"/>
  </div>
</template>

<script>
import LineChart from "./components/LineChart.vue";
import BarChart from "./components/BarChart.vue";
import PlayerDetails from "./components/PlayerDetails.vue";

export default {
  name: "App",
  components: {
    LineChart,
    BarChart,
    PlayerDetails
  },
  computed: {
    raceNamesWithData() {
      return this.raceNames.slice(0, this.teamScores.length);
    }
  },
  data() {
    return {
      raceNames: [
        "Austria",
        "Steiermark",
        "Hungary",
        "Britian",
        "Britian Returns",
        "Spain",
        "Belgium",
        "Italy"
      ],
      teamScores: [
        {
          player: "Eoghan",
          colour: "#58D68D",
          scores: [124, 204, 271, 125],
          total() {
            return this.scores.reduce(
              (accumulator, currentValue) => accumulator + currentValue
            );
          }
        },
        {
          player: "Gerard",
          colour: "#C0392B",
          scores: [109, 186, 157, 136],
          total() {
            return this.scores.reduce(
              (accumulator, currentValue) => accumulator + currentValue
            );
          }
        },
        {
          player: "Shauna",
          colour: "#7FB3D5",
          scores: [80, 181, 47, 147],
          total() {
            return this.scores.reduce(
              (accumulator, currentValue) => accumulator + currentValue
            );
          }
        },
        {
          player: "Stone",
          colour: "#6E2C00",
          scores: [119, 176, 83, 176],
          total() {
            return this.scores.reduce(
              (accumulator, currentValue) => accumulator + currentValue
            );
          }
        }
      ]
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
