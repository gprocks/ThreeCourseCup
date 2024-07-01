<template>
  <div>
    <div>
      <div class="dropdown mb-2 btn-group d-flex">
        <button
          id="dropdownMenuButton1"
          type="button"
          class="btn btn-secondary dropdown-toggle btn-block"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span class="h2">Leaderboard {{ internalYear }}</span>
        </button>
        <ul
          class="dropdown-menu dropdown-menu-dark dropdown-menu-end"
          aria-labelledby="dropdownMenuButton1"
        >
          <li :key="`ddi${y}`" v-for="y in years" @click="internalYear = y">
            <a class="dropdown-item" href="#">{{ y }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div v-for="(item, index) in rankedList" :key="index">
      <div
        v-if="index > 0 && getStrinkingDistance(item, rankedList[index - 1])"
        class="row no-gutters striking-distance"
      >
        <div class="col text-left mr-1">
          <div class="player-name">
            <span
              class="team-color-icon"
              :style="{ 'background-color': item.colour }"
              >&nbsp;</span
            >{{ item.player }}
          </div>
          <div class="mt-3">
            Chasing <span class="text-bold">{{ getPosition(index) }}</span>
          </div>
        </div>
        <div class="col-5">
          <div class="main-block mb-2">
            <div class="header">Striking distance</div>
            <div class="body">
              in
              <span class="numeric">{{
                getStrinkingDistance(item, rankedList[index - 1])
              }}</span>
              races
            </div>
          </div>
        </div>
        <div class="col text-left ml-1">
          <div class="player-name">
            <span
              class="team-color-icon"
              :style="{ 'background-color': rankedList[index - 1].colour }"
              >&nbsp;</span
            >{{ rankedList[index - 1].player }}
          </div>
          <div class="mt-3">
            <span class="text-bold">{{
              rankedList[index - 1].total - item.total
            }}</span>
            ahead
          </div>
        </div>
      </div>

      <div class="player">
        <div>
          <span>Player:</span>
          <span v-if="index === 0">&#128081;</span>
          <span v-if="index === 1">&#129352;</span>
          <span v-if="index === 2">&#129353;</span>
          <span v-if="index === rankedList.length - 1">&#129364;</span>
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
          {{ raceNames[indexOfMax(item.scores)] }} ({{
            item.scores[indexOfMax(item.scores)]
          }})
        </div>
        <div>
          <span>Recent average:</span>
          {{ getAverage(item.scores) }}
        </div>
        <div class="row">
          <div class="col" v-if="getGapToFirst(item)">
            <span>Gap to first:</span>
            {{ getGapToFirst(item) }}
          </div>
          <div class="col" v-if="getGapToNext(index)">
            <span> Gap to next: </span>
            {{ getGapToNext(index) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mean } from "mathjs";
// import { BDropdown, BDropdownItem } from "bootstrap-vue";
export default {
  components: {
    // BDropdown,
    // BDropdownItem,
  },
  props: {
    teamScores: {
      type: Array,
      required: true,
    },
    raceNames: {
      type: Array,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      years: ["2020", "2021", "2022", "2023", "2024"],
    };
  },
  computed: {
    rankedList() {
      let tempArray = [...this.teamScores];
      return tempArray.sort((a, b) => b.total - a.total);
    },
    internalYear: {
      get() {
        return this.year;
      },
      set(newVal) {
        this.$emit("update:year", newVal);
      },
    },
  },
  methods: {
    getPosition(position) {
      switch (position) {
        case 1:
          return "1st";
        case 2:
          return "2nd";
        case 3:
          return "3rd";
      }
    },
    getStrinkingDistance(teamA, teamB) {
      const aRate = this.getAverage(teamA.scores);
      const bRate = this.getAverage(teamB.scores);
      console.log("compare", teamA, teamB)
      console.log("",aRate, bRate, aRate > bRate)
      if (aRate > bRate) {
        const deficit = teamB.total - teamA.total;
        const surplus = aRate - bRate;

        return Math.ceil(deficit / surplus);
      }
      return 0;
    },
    getGapToFirst(team) {
      return this.rankedList[0].total - team.total;
    },
    getGapToNext(index) {
      if (index) {
        return this.rankedList[index - 1].total - this.rankedList[index].total;
      }
      return 0;
    },
    getAverage(scores) {
      if (!scores.length) {
        return 0;
      } else {
        const recentResults =
          scores.length > 3
            ? scores.slice(Math.max(scores.length - 3, 1))
            : scores;
        return mean(recentResults).toFixed(2);
      }
    },
    indexOfMax(arr) {
      if (arr.length === 0) {
        return -1;
      }

      var max = arr[0];
      var maxIndex = 0;

      for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
        }
      }

      return maxIndex;
    },
  },
};
</script>

<style scoped lang="scss">
.text-bold {
  font-weight: bold;
}
.player {
  padding: 1rem;
  background-color: #2b3035;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  span {
    font-weight: bold;
    color: #17b06b;
  }
}
.team-color-icon {
  width: 4px;
  height: 14px;
  margin: 0 5px 0 0;
  background-color: red;
}
.striking-distance {
  .player-name {
    text-transform: uppercase;
    font-weight: bolder;
  }
  .main-block {
    border: 2px solid #ffdb4e;
    font-weight: bolder;
    .header {
      background-color: #ffdb4e;
      color: #2b3035;
    }
    .numeric {
      font-size: 20pt;
    }
  }
}
</style>
