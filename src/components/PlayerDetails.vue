<template>
  <div>
    <div>
      <b-dropdown
        class="mb-2"
        block
        split
        right
      >
        <template #button-content>
          <span class="h2">Leaderboard {{ internalYear }}</span>
        </template>
        <b-dropdown-item
          v-for="y in years"
          :key="`ddi${y}`"
          @click="internalYear=y"
        >
          {{ y }}
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div
      v-for="(item,index) in rankedList"
      :key="index"
    >
      <div
        v-if="index>0 && getStrinkingDistance(item ,rankedList[index-1])"
        class="row no-gutters striking-distance"
      >
        <div class="col text-left mr-1">
          <div class="player-name">
            <span
              class="team-color-icon"
              :style="{'background-color': item.colour}"
            >&nbsp;</span>{{ item.player }}
          </div>
          <div class="mt-3">
            Chasing <span class="text-bold">{{ getPosition(index) }}</span>
          </div>
        </div>
        <div class="col-5">
          <div class="main-block mb-2 ">
            <div class="header">
              Striking distance
            </div>
            <div class="body">
              in <span class="numeric">{{ getStrinkingDistance(item,rankedList[index-1]) }}</span> races
            </div>
          </div>
        </div>
        <div class="col text-left ml-1">
          <div class="player-name">
            <span
              class="team-color-icon"
              :style="{'background-color': rankedList[index-1].colour}"
            >&nbsp;</span>{{ rankedList[index-1].player }}
          </div>
          <div class="mt-3">
            <span class="text-bold">{{ rankedList[index-1].total-item.total }}</span> ahead
          </div>
        </div>
      </div>

      <div class="player">
        <div>
          <span>Player:</span>
          <span v-if="index===0">&#128081;</span>
          <span v-if="index===1">&#129352;</span>
          <span v-if="index===2">&#129353;</span>
          <span v-if="index===3">&#129364;</span>
          {{ item.player }}
        </div>
        <div>
          <span>League Position:</span>
          {{ index + 1 }}
        </div>
        <div>
          <span>Total Score:</span>
          {{ item.total }}
        </div>
        <div>
          <span>Highest weekly score:</span>
          {{ raceNames[indexOfMax(item.scores)] }} ({{ item.scores[indexOfMax(item.scores)] }})
        </div>
        <div>
          <span>Recent average:</span>
          {{ getAverage(item.scores) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mean } from 'mathjs'
import { BDropdown, BDropdownItem } from 'bootstrap-vue'
export default {
  components: {
    BDropdown,
    BDropdownItem
  },
  props: {
    teamScores: {
      type: Array,
      required: true
    },
    raceNames: {
      type: Array,
      required: true
    },
    year: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      years: ['2020', '2021', '2022']
    }
  },
  computed: {
    rankedList () {
      let tempArray = [...this.teamScores]
      return tempArray.sort((a, b) => b.total - a.total)
    },
    internalYear: {
      get () { return this.year },
      set (newVal) {
        this.$emit('update:year', newVal)
      }
    }
  },
  methods: {
    getPosition (position) {
      switch (position) {
        case 1:
          return '1st'
        case 2:
          return '2nd'
        case 3:
          return '3rd'
      }
    },
    getStrinkingDistance (teamA, teamB) {
      const aRate = this.getAverage(teamA.scores)
      const bRate = this.getAverage(teamB.scores)
      if (aRate > bRate) {
        const deficit = teamB.total - teamA.total
        const surplus = aRate - bRate

        return Math.ceil(deficit / surplus)
      }
      return 0
    },
    getAverage (scores) {
      if (!scores.length) {
        return 0
      } else {
        const recentResults = scores.length > 3 ? scores.slice(Math.max(scores.length - 3, 1)) : scores
        return mean(recentResults).toFixed(2)
      }
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
.text-bold{
  font-weight: bold;
}
.player {
  padding:1rem;
  border: 1px solid black;
  border-radius: 0.25rem;
  margin-bottom:1rem;
  span {
    font-weight: bold;
  }
}
.team-color-icon{
  width: 4px;
    height: 14px;
    margin: 0 5px 0 0;
    background-color:red
}
.striking-distance{
  .player-name{
    text-transform: uppercase;
    font-weight: bolder;
  }
  .main-block{
  border: 2px solid #f59842;
  font-weight: bolder;
  .header{
    background-color: #f59842;;
  }
  .numeric{
    font-size: 20pt;
  }
  }
}
</style>
