<template>
  <Bar ref="bar" :data="test" :options="chartOptions" />
</template>
<script lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.defaults.color = "#17b06b";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  annotationPlugin
);
import { Bar } from "vue-chartjs";

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
    Bar,
  },
  data() {
    return {};
  },
  computed: {
    test() {
      return {
        labels: this.raceNames,
        datasets: this.chartData,
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          annotation: {
            annotations: [
              {
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                yMin: this.totalAverage,
                yMax: this.totalAverage,
                borderColor: "rgba(0,0,0,0.6)",
                borderWidth: 2,
              },
              {
                type: "label",
                content: "Average: " + this.totalAverage,
                yValue: this.totalAverage,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "white",
                borderRadius: 4,
              },
            ],
          },
          title: {
            display: true,
            text: "Per Race Scores",
            color: "#FFFFFF",
            font: {
              size: 16,
            },
          },
        },
      };
    },
    chartData() {
      return this.teamScores.map((team) => {
        return {
          label: team.player,
          data: team.scores,
          borderWidth: 2,
          backgroundColor: this.hexToRGB(team.colour, 0.6),
          borderColor: team.colour,
        };
      });
    },
    totalAverage() {
      const totalScore = this.teamScores.reduce(
        (accumulator, currentValue) => accumulator + currentValue.total,
        0
      );
      return (
        totalScore /
        (this.teamScores.length * this.raceNames.length)
      ).toFixed(2);
    },
  },
  watch: {},

  methods: {
    hexToRGB(hex, alpha) {
      var r = parseInt(hex.slice(1, 3), 16);
      var g = parseInt(hex.slice(3, 5), 16);
      var b = parseInt(hex.slice(5, 7), 16);

      if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
      } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
      }
    },
  },
};
</script>
