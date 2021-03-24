<script>
import { Bar } from 'vue-chartjs'
import 'chartjs-plugin-annotation'

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
  data () {
    return {
      showAverageLineLabel: false
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
    },
    totalAverage () {
      const totalScore = this.teamScores.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0)
      return (totalScore / (this.teamScores.length * this.raceNames.length)).toFixed(2)
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
        },
        annotation: {
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.totalAverage,
            borderColor: 'rgba(0,0,0,0.6)',
            borderWidth: 2,
            label: {
              enabled: true,
              content: 'Average: ' + this.totalAverage,
              backgroundColor: 'rgba(0,0,0,0.6)'
            }
          }]
        }
      }
    )
  }
}
</script>
