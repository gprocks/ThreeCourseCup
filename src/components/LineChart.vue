<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  data() {
    return {};
  },
  props: {
    teamScores: {
      type: Array,
      required: true
    },
    raceNames: {
      type: Array,
      required: true
    }
  },
  computed: {
    chartData() {
      return this.teamScores.map(team => {
        return {
          label: team.player,
          data: team.scores.reduce(this.getSum, []),
          backgroundColor: "transparent",
          borderColor: team.colour,
          pointBackgroundColor: team.colour
        };
      });
    }
  },

  mounted() {
    this.renderChart(
      {
        labels: this.raceNames,
        datasets: this.chartData
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Total points history"
        }
      }
    );
  },
  methods: {
    getSum(r, a) {
      a += r[r.length - 1] || 0;
      r.push(a);
      return r;
    }
  }
};
</script>