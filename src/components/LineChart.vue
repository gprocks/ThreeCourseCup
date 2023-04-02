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
        plugins: {
          title: {
            display: true,
            text: "Total points history",
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
      return this.teamScores.map((team) => {
        return {
          label: team.player,
          data: team.scores.reduce(this.getSum, []),
          backgroundColor: team.colour,
          borderColor: team.colour,
          borderWidth: 2,
          pointBackgroundColor: team.colour,
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
  },
};
</script>
