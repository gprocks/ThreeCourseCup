<template>
  <div v-if="!loading" id="app" data-bs-theme="dark">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-3 col-12">
          <player-details
            :team-scores="teamScoresSorted"
            :race-names="raceNamesWithData"
            v-model:year="year"
          />
        </div>
        <div class="col">
          <div style="width: 100%" class="btn-group btn-group-justified mb-2">
            <button
              type="button"
              class="btn btn-secondary"
              :disabled="showComponent === 2"
              @click="showComponent = 2"
            >
              Leaderboard History
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              :disabled="showComponent === 0"
              @click="showComponent = 0"
            >
              Total Points History
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              :disabled="showComponent === 1"
              @click="showComponent = 1"
            >
              Per Race Score
            </button>
          </div>
          <div v-if="showComponent === 0" div class="row">
            <div class="col">
              <div class="chart-area p-3">
                <ScoreHistory
                  :team-scores="teamScoresSorted"
                  :race-names="raceNamesWithData"
                />
              </div>
            </div>
          </div>
          <div v-if="showComponent === 1" class="row">
            <div class="col">
              <div class="chart-area">
                <RaceBreakdown
                  ref="barchart"
                  :team-scores="teamScoresSorted"
                  :race-names="raceNamesWithData"
                />
              </div>
            </div>
          </div>
          <div v-if="showComponent === 2" class="row">
            <div class="col">
              <div class="chart-area">
                <LeaderboardHistory
                  ref="leaderboardhistory"
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
import ScoreHistory from "./components/ScoreHistory.vue";
import RaceBreakdown from "./components/RaceBreakdown.vue";
import PlayerDetails from "./components/PlayerDetails.vue";
import LeaderboardHistory from "./components/LeaderboardHistory.vue";
// @ts-ignore
import genericService from "./serviceslocal/genericService.js";

export default {
  name: "App",
  components: {
    ScoreHistory,
    RaceBreakdown,
    PlayerDetails,
    LeaderboardHistory,
  },
  data() {
    return {
      loading: true,
      showComponent: 2,
      year: "",
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
  async mounted() {
    let lastYear = new Date().getFullYear();
    await genericService.getRaceList(lastYear).catch(() => {
      // If the request fails, we assume the last year is the current year
      lastYear = lastYear - 1;
    });
    this.year = lastYear.toString();
    this.init();
  },
};
</script>
