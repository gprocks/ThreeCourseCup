<template>
  <div v-if="!loading" id="app" data-bs-theme="dark">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-3 col-12">
          <player-details
            :team-scores="teamScores"
            :race-names="raceNamesWithData"
            v-model:year="year"
          />
        </div>
        <div class="col">
          <div style="width: 100%" class="btn-group btn-group-justified mb-2">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showComponent = 0"
            >
              Total Points History
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="showComponent = 1"
            >
              Per Race Score
            </button>
          </div>
          <div v-if="showComponent === 0" div class="row">
            <div class="col">
              <div class="chart-area p-3">
                <line-chart
                  :team-scores="teamScoresSorted"
                  :race-names="raceNamesWithData"
                />
              </div>
            </div>
          </div>
          <div v-if="showComponent === 1" class="row">
            <div class="col">
              <div class="chart-area">
                <bar-chart
                  ref="barchart"
                  :team-scores="teamScoresSorted"
                  :race-names="raceNamesWithData"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import clonedeep from "lodash.clonedeep";
import LineChart from "./components/LineChart.vue";
import BarChart from "./components/BarChart.vue";
import PlayerDetails from "./components/PlayerDetails.vue";
// @ts-ignore
import genericService from "./serviceslocal/genericService.js";

export default {
  name: "App",
  components: {
    LineChart,
    BarChart,
    PlayerDetails,
  },
  data() {
    return {
      loading: true,
      showComponent: 0,
      year: "2024",
      raceNames: [],
      teamScores: [],
    };
  },
  computed: {
    raceNamesWithData() {
      return this.teamScores[0]
        ? this.raceNames.slice(0, this.teamScores[0].scores.length)
        : [];
    },
    teamScoresSorted() {
      if (!this.teamScores.length) {
        return [];
      } else {
        let sortedScores = clonedeep(this.teamScores);
        sortedScores.sort((a, b) => {
          return b.total - a.total;
        });
        sortedScores[sortedScores.length - 1].player =
          "Chef " + sortedScores[sortedScores.length - 1].player;
        return sortedScores;
      }
    },
  },
  watch: {
    year() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      Promise.all([
        genericService.getRaceList(this.year),
        genericService.getScores(this.year),
      ]).then((respArray) => {
        this.getRaceList(respArray[0]);
        this.getScores(respArray[1]);
        this.loading = false;
      });
    },
    getRaceList(resp) {
      this.raceNames = resp;
    },
    getScores(resp) {
      this.teamScores = resp.map((item) => {
        item.total = this.getTotalScore(item.scores);
        return item;
      });
    },
    getTotalScore(scores) {
      return scores.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
    },
  },
};
</script>
