<template lang="html">
  <div id="app" v-if="!loading">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-3 col-12">
          <PlayerDetails :team-scores="teamScores"
          :race-names="raceNamesWithData"
          :year.sync="year"/>
        </div>
        <div class="col">
          <div style="width:100%" class="btn-group btn-group-justified">
            <button type="button" class="btn btn-secondary" @click="showComponent=0">Total Points History</button>
            <button type="button" class="btn btn-secondary" @click="showComponent=1">Per Race Score</button>
          </div>
          <div div class="row" v-if="showComponent===0">
            <div class="col">
              <LineChart :team-scores="teamScoresSorted" :race-names="raceNamesWithData"/>
            </div>
          </div>
          <div class="row" v-if="showComponent===1">
            <div class="col">
              <BarChart :team-scores="teamScoresSorted" :race-names="raceNamesWithData"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clonedeep from 'lodash.clonedeep'
import LineChart from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import PlayerDetails from './components/PlayerDetails.vue'

import genericService from './Services/genericService'

export default {
  name: 'App',
  components: {
    LineChart,
    BarChart,
    PlayerDetails
  },
  watch: {
    year () {
      this.init()
    }
  },
  computed: {
    raceNamesWithData () {
      return this.raceNames.slice(0, this.teamScores[0].scores.length)
    },
    teamScoresSorted () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      let sortedScores = clonedeep(this.teamScores.sort((a, b) => {
        return a.total - b.total
      }))
      sortedScores[sortedScores.length - 1].player = 'Chef ' + sortedScores[sortedScores.length - 1].player
      return sortedScores
    }
  },
  data () {
    return {
      loading: true,
      showComponent: 0,
      year: '2021',
      raceNames: [],
      teamScores: []
    }
  },
  methods: {
    init () {
      this.getRaceList()
      this.getScores()
    },
    getRaceList () {
      genericService.getRaceList(this.year).then(resp => {
        this.raceNames = resp
        this.loading = false
      })
    },
    getScores () {
      genericService.getScores(this.year).then(resp => {
        this.teamScores = resp.map(item => {
          item.total = this.getTotalScore(item.scores)
          return item
        })
        this.loading = false
      })
    },
    getTotalScore (scores) {
      return scores.reduce(
        (accumulator, currentValue) => { return accumulator + currentValue }, 0
      )
    }
  },
  created () {
    this.init()
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
