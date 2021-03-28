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
          borderWidth: 2,
          backgroundColor: this.hexToRGB(team.colour, 0.6),
          borderColor: team.colour
        }
      })
    },
    totalAverage () {
      const totalScore = this.teamScores.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0)
      return (totalScore / (this.teamScores.length * this.raceNames.length)).toFixed(2)
    }
  },
  watch: {
    raceNames: {
      handler () {
        this.drawChart()
      },
      deep: true
    }
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
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
    },
    hexToRGB (hex, alpha) {
      var r = parseInt(hex.slice(1, 3), 16)
      var g = parseInt(hex.slice(3, 5), 16)
      var b = parseInt(hex.slice(5, 7), 16)

      if (alpha) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
      } else {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')'
      }
    }

  }
}
</script>
