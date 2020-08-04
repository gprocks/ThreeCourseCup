<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
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
    chartData () {
      return this.teamScores.map(team => {
        return {
          label: team.player,
          data: team.scores,
          backgroundColor: team.colour,
          borderColor: team.colour
        }
      })
    }
  },
  mounted () {
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
          text: 'Per Race Scores'
        }
      }
    )
  }
}
</script>
