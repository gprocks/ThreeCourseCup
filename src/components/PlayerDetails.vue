<template>
  <div>
    <h2>Leaderboard</h2>
    <div v-for="(item,index) in rankedList" :key="index">
      <div class="striking-distance mb-2" v-if="index>0 && getStrinkingDistance(item ,rankedList[index-1])">
        <div class="header">Striking distance </div>
        <div class="body">
          in <span class="numeric">{{getStrinkingDistance(item,rankedList[index-1])}}</span> races
        </div>

      </div>
      <div class="player" >

        <div>
          <span>Player:</span>
          <span v-if="index===0">&#128081;</span>
          <span v-if="index===1">&#129352;</span>
          <span v-if="index===2">&#129353;</span>
          <span v-if="index===3">&#129364;</span>
          {{item.player}}
        </div>
        <div>
          <span>League Position:</span>
          {{index + 1}}
        </div>
        <div>
          <span>Total Score:</span>
          {{item.total()}}
        </div>
        <div>
          <span>Highest weekly score:</span>
          {{raceNames[indexOfMax(item.scores)]}} ({{item.scores[indexOfMax(item.scores)]}})
        </div>
        <div>
          <span>Recent average:</span>
          {{getAverage(item.scores)}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mean } from 'mathjs'
export default {
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
    rankedList () {
      let tempArray = [...this.teamScores]
      return tempArray.sort((a, b) => b.total() - a.total())
    }
  },
  methods: {
    getStrinkingDistance (teamA, teamB) {
      const aRate = this.getAverage(teamA.scores)
      const bRate = this.getAverage(teamB.scores)
      if (aRate > bRate) {
        const deficit = teamB.total() - teamA.total()
        const surplus = aRate - bRate

        return Math.ceil(deficit / surplus)
      }
      return 0
    },
    getAverage (scores) {
      const recentResults = scores.slice(Math.max(scores.length - 3, 1))
      return mean(recentResults).toFixed(2)
    },
    indexOfMax (arr) {
      if (arr.length === 0) {
        return -1
      }

      var max = arr[0]
      var maxIndex = 0

      for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
          maxIndex = i
          max = arr[i]
        }
      }

      return maxIndex
    }
  }
}
</script>

<style scoped lang="scss">
.player {
  padding:1rem;
  border: 1px solid black;
  border-radius: 0.25rem;
  margin-bottom:1rem;
  span {
    font-weight: bold;
  }
}
.striking-distance{
  border: 2px solid #f59842;
  font-weight: bolder;
  .header{
    background-color: #f59842;;
  }
  .numeric{
    font-size: 20pt;
  }
}
</style>
