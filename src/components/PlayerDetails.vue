<template>
  <div>
    <h2>Leaderboard</h2>
    <div class="player" v-for="(item,index) in rankedList" :key="index">
      <div>
        <span>Player:</span>
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
    </div>
  </div>
</template>

<script>
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
  data() {
    return {};
  },
  computed: {
    rankedList() {
      let tempArray = [...this.teamScores];
      return tempArray.sort((a, b) => b.total() - a.total());
    }
  },
  methods: {

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
    }
  }
};
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
</style>