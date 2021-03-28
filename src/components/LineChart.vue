<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
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
    return {}
  },
  computed: {
    chartData () {
      return this.teamScores.map(team => {
        return {
          label: team.player,
          data: team.scores.reduce(this.getSum, []),
          backgroundColor: 'transparent',
          borderColor: team.colour,
          pointBackgroundColor: team.colour
        }
      })
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
    getSum (r, a) {
      a += r[r.length - 1] || 0
      r.push(a)
      return r
    },
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
            text: 'Total points history'
          }
        }
      )
    }
  }
}
</script>
