<template>
  <LineChart :data="test" :options="chartOptions" />
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line as LineChart } from "vue-chartjs";

ChartJS.defaults.color = "#17b06b";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  props: {
    teamScores: {
      type: Array,
      required: true,
    },
    raceNames: {
      type: Array,
      required: true,
    },
  },
  components: {
    LineChart,
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        color: "#17b06b",
        scales: {
          y: {
            reverse: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Leaderboard history",
            color: "#FFFFFF",
            font: {
              size: 16,
            },
          },
        },
      },
    };
  },
  computed: {
    test() {
      return {
        labels: this.raceNames,
        datasets: this.chartData,
      };
    },
    chartData() {
      let positionObject = this.calculatePlayerPositions(this.teamScores);
      return this.teamScores.map((team) => {
        return {
          label: team.player,
          data: positionObject[team.player],
          backgroundColor: team.colour,
          borderColor: team.colour,
          borderWidth: 2,
          pointBackgroundColor: team.colour,
          tension: 0.4,
          cubicInterpolationMode: "monotone",
        };
      });
    },
  },
  watch: {},

  methods: {
    getSum(r, a) {
      a += r[r.length - 1] || 0;
      r.push(a);
      return r;
    },
    calculatePlayerPositions(players) {
      console.log(players);
      const maxStages = Math.max(...players.map((p) => p.scores.length));
      let positionObject = {};

      // For each stage
      for (let stage = 0; stage < maxStages; stage++) {
        const stageResults = [];

        // Calculate cumulative score for each player at this stage
        players.forEach((player) => {
          if (stage < player.scores.length) {
            const cumulativeScore = player.scores
              .slice(0, stage + 1)
              .reduce((sum, score) => sum + score, 0);
            stageResults.push({
              player: player.player,
              cumulativeScore: cumulativeScore,
              currentRoundScore: player.scores[stage],
            });
          }
        });

        // Sort by cumulative score (highest first) and assign positions
        stageResults.sort((a, b) => b.cumulativeScore - a.cumulativeScore);

        // Add position to each player
        stageResults.forEach((player, index) => {
          player.position = index + 1;
          if (!positionObject[player.player]) {
            positionObject[player.player] = [];
          }
          positionObject[player.player].push(player.position);
        });
      }
      console.log("Position Object:", positionObject);
      return positionObject;
      // return players.map((team) => {
      //   return {
      //     label: team.player,
      //     data: positionObject[team.player],
      //     backgroundColor: team.colour,
      //     borderColor: team.colour,
      //     borderWidth: 2,
      //     pointBackgroundColor: team.colour,
      //   };
      // });
    },
  },
};
</script>
