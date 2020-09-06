<template lang="html">
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-3 col-12">
          <PlayerDetails :team-scores="teamScores" :race-names="raceNamesWithData"/>
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

export default {
  name: 'App',
  components: {
    LineChart,
    BarChart,
    PlayerDetails
  },
  computed: {
    raceNamesWithData () {
      return this.raceNames.slice(0, this.teamScores[0].scores.length)
    },
    teamScoresSorted () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      let sortedScores = clonedeep(this.teamScores.sort((a, b) => {
        let scorea = a.total()
        let scoreb = b.total()
        return scoreb - scorea
      }))
      sortedScores[sortedScores.length - 1].player = 'Chef ' + sortedScores[sortedScores.length - 1].player
      return sortedScores
    }
  },
  data () {
    return {
      showComponent: 0,
      raceNames: [
        'Austria',
        'Steiermark',
        'Hungary',
        'Britain',
        'Britain Returns',
        'Spain',
        'Belgium',
        'Italy',
        'Tuscany',
        'Russia',
        'Eifel',
        'Portugal',
        'Imola',
        'Turkey',
        'Bahrain',
        'Bahrain II',
        'Abu Dhabi'
      ],
      teamScores: [
        {
          player: 'Eoghan',
          colour: '#58D68D',
          scores: [124, 198, 271, 125, 185, 220, 161, 170],
          total () {
            return this.scores.reduce(
              (accumulator, currentValue) => accumulator + currentValue
            )
          }
        },
        {
          player: 'Gerard',
          colour: '#C0392B',
          scores: [109, 186, 157, 136, 289, 228, 193, 155],
          total () {
            return this.scores.reduce(
              (accumulator, currentValue) => accumulator + currentValue
            )
          }
        },
        {
          player: 'Shauna',
          colour: '#7FB3D5',
          scores: [80, 181, 47, 147, 279, 222, 171, 177],
          total () {
            return this.scores.reduce(
              (accumulator, currentValue) => accumulator + currentValue
            )
          }
        },
        {
          player: 'Stone',
          colour: '#6E2C00',
          scores: [119, 176, 83, 176, 179, 227, 169, 177],
          total () {
            return this.scores.reduce(
              (accumulator, currentValue) => accumulator + currentValue
            )
          }
        }
      ]
    }
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
