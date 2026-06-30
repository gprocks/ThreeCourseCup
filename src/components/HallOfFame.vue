<template>
  <div class="hall-of-fame p-3">
    <div class="mb-3 text-start">
      <RouterLink to="/" class="btn btn-secondary">← Season View</RouterLink>
    </div>
    <div v-if="loading" class="text-center py-5 text-muted">Loading...</div>
    <div v-else>
      <h3 class="mb-4">All-Time Standings</h3>

      <!-- Desktop table -->
      <div class="table-responsive mb-5 d-none d-md-block">
        <table class="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="text-muted">#</th>
              <th>Player</th>
              <th>Total Pts</th>
              <th>Season Wins</th>
              <th>Race Wins</th>
              <th>Best Race</th>
              <th>Best Season</th>
              <th>Avg / Race</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in playerStats" :key="p.player">
              <td class="text-muted">{{ i + 1 }}</td>
              <td>
                <span
                  class="colour-bar me-2"
                  :style="{ backgroundColor: p.colour }"
                ></span>
                {{ p.player }}
              </td>
              <td class="fw-bold">{{ p.totalPoints.toLocaleString() }}</td>
              <td>{{ p.seasonWins }}</td>
              <td>{{ p.raceWins }}</td>
              <td>
                {{ p.bestRaceScore.toLocaleString() }}
                <small class="text-muted d-block">({{ p.bestRaceYear }})</small>
              </td>
              <td>
                <template v-if="p.bestSeasonTotal > 0">
                  {{ p.bestSeasonTotal.toLocaleString() }}
                  <small class="text-muted d-block"
                    >({{ p.bestSeasonYear }})</small
                  >
                </template>
                <span v-else class="text-muted">—</span>
              </td>
              <td>{{ p.avgScore.toFixed(1) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile cards -->
      <div class="d-md-none mb-5">
        <div
          v-for="(p, i) in playerStats"
          :key="p.player"
          class="standing-card mb-3"
        >
          <div class="standing-card-header">
            <span class="standing-position text-muted">{{ i + 1 }}</span>
            <span
              class="colour-bar mx-2"
              :style="{ backgroundColor: p.colour }"
            ></span>
            <span class="standing-name">{{ p.player }}</span>
            <span class="standing-total ms-auto fw-bold"
              >{{ p.totalPoints.toLocaleString() }} pts</span
            >
          </div>
          <div class="standing-card-body">
            <div class="standing-stat">
              <span class="standing-stat-label">Season Wins</span>
              <span class="standing-stat-value">{{ p.seasonWins }}</span>
            </div>
            <div class="standing-stat">
              <span class="standing-stat-label">Race Wins</span>
              <span class="standing-stat-value">{{ p.raceWins }}</span>
            </div>
            <div class="standing-stat">
              <span class="standing-stat-label">Best Race</span>
              <span class="standing-stat-value">
                {{ p.bestRaceScore.toLocaleString() }}
                <small class="text-muted">({{ p.bestRaceYear }})</small>
              </span>
            </div>
            <div class="standing-stat">
              <span class="standing-stat-label">Best Season</span>
              <span class="standing-stat-value">
                <template v-if="p.bestSeasonTotal > 0">
                  {{ p.bestSeasonTotal.toLocaleString() }}
                  <small class="text-muted">({{ p.bestSeasonYear }})</small>
                </template>
                <span v-else class="text-muted">—</span>
              </span>
            </div>
            <div class="standing-stat">
              <span class="standing-stat-label">Avg / Race</span>
              <span class="standing-stat-value">{{
                p.avgScore.toFixed(1)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <h3 class="mb-3">Season Champions</h3>
      <div class="d-flex flex-wrap gap-3 mb-5">
        <div v-for="sw in seasonWinners" :key="sw.year" class="season-badge">
          <div class="season-year">{{ sw.year }}</div>
          <div class="season-player" :style="{ color: sw.colour }">
            {{ sw.player }}
          </div>
          <div class="season-total">{{ sw.total.toLocaleString() }}</div>
        </div>
      </div>

      <h3 class="mb-3">Records</h3>
      <div class="row g-3">
        <div class="col-md-6 col-lg-4" v-for="r in records" :key="r.label">
          <div class="record-card">
            <div class="record-label">{{ r.label }}</div>
            <div class="record-holder">
              <span
                class="colour-bar me-2"
                :style="{ backgroundColor: r.colour }"
              ></span>
              {{ r.holder }}
            </div>
            <div class="record-value">{{ r.value }}</div>
            <div v-if="r.context" class="record-context">{{ r.context }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import genericService from "../serviceslocal/genericService.js";

export default {
  name: "HallOfFame",
  data() {
    return {
      loading: true,
      playerStats: [] as any[],
      seasonWinners: [] as any[],
      records: [] as any[],
    };
  },
  async mounted() {
    const startYear = 2020;
    let lastYear = new Date().getFullYear();
    await genericService.getRaceList(lastYear).catch(() => {
      lastYear = lastYear - 1;
    });

    const years = Array.from(
      { length: lastYear - startYear + 1 },
      (_, i) => startYear + i
    );

    const allData = await Promise.all(
      years.map((year) =>
        Promise.all([
          genericService.getRaceList(year),
          genericService.getSeasonData(year),
        ]).then(([raceList, { teamScores, isComplete }]) => ({
          year,
          raceList,
          teamScores,
          isComplete,
        }))
      )
    );

    this.processData(allData);
    this.loading = false;
  },
  methods: {
    processData(allData: any[]) {
      const ERA_CUTOFF = 2024;

      // Derive the multiplier from complete seasons on each side of the cutoff
      let oldSum = 0,
        oldCount = 0,
        newSum = 0,
        newCount = 0;
      for (const { year, teamScores, isComplete } of allData) {
        if (!isComplete || !teamScores?.length) continue;
        for (const ts of teamScores) {
          const scores: number[] = ts.scores;
          const total = scores.reduce((a, b) => a + b, 0);
          if (year < ERA_CUTOFF) {
            oldSum += total;
            oldCount += scores.length;
          } else {
            newSum += total;
            newCount += scores.length;
          }
        }
      }
      const oldAvg = oldCount > 0 ? oldSum / oldCount : 1;
      const newAvg = newCount > 0 ? newSum / newCount : oldAvg;
      const eraMultiplier = newAvg / oldAvg;

      const playerMap = new Map<string, any>();
      const seasonWinners: any[] = [];
      const seasonMargins: any[] = [];

      for (const { year, teamScores, isComplete } of allData) {
        if (!teamScores || !teamScores.length) continue;

        for (const ts of teamScores) {
          if (!playerMap.has(ts.player)) {
            playerMap.set(ts.player, {
              player: ts.player,
              colour: ts.colour,
              totalPoints: 0,
              adjustedTotalPoints: 0,
              seasonWins: 0,
              raceWins: 0,
              bestRaceScore: 0,
              bestRaceYear: 0,
              bestSeasonTotal: 0,
              bestSeasonYear: 0,
              allScores: [] as number[],
            });
          }
        }

        if (isComplete) {
          const seasonTotals = teamScores
            .map((ts: any) => ({
              player: ts.player,
              colour: ts.colour,
              total: (ts.scores as number[]).reduce(
                (a: number, b: number) => a + b,
                0
              ),
            }))
            .sort((a: any, b: any) => b.total - a.total);
          const champion = seasonTotals[0];
          const runnerUp = seasonTotals[1];
          const margin = champion.total - runnerUp.total;
          seasonWinners.push({ year, ...champion });
          seasonMargins.push({
            year,
            player: champion.player,
            colour: champion.colour,
            margin,
          });
          playerMap.get(champion.player)!.seasonWins++;
        }

        for (const ts of teamScores) {
          const p = playerMap.get(ts.player)!;
          const scores: number[] = ts.scores;
          const seasonTotal = scores.reduce((a, b) => a + b, 0);

          p.totalPoints += seasonTotal;
          p.adjustedTotalPoints +=
            year < ERA_CUTOFF ? seasonTotal * eraMultiplier : seasonTotal;
          p.allScores.push(...scores);

          if (isComplete && seasonTotal > p.bestSeasonTotal) {
            p.bestSeasonTotal = seasonTotal;
            p.bestSeasonYear = year;
          }

          for (const score of scores) {
            if (score > p.bestRaceScore) {
              p.bestRaceScore = score;
              p.bestRaceYear = year;
            }
          }
        }

        const numRounds = (teamScores[0].scores as number[]).length;
        for (let r = 0; r < numRounds; r++) {
          let maxScore = -Infinity;
          const roundWinners: string[] = [];
          for (const ts of teamScores) {
            const score: number = ts.scores[r];
            if (score === undefined) continue;
            if (score > maxScore) {
              maxScore = score;
              roundWinners.length = 0;
              roundWinners.push(ts.player);
            } else if (score === maxScore) {
              roundWinners.push(ts.player);
            }
          }
          for (const w of roundWinners) {
            if (playerMap.has(w)) playerMap.get(w)!.raceWins++;
          }
        }
      }

      const stats: any[] = Array.from(playerMap.values()).map((p) => ({
        ...p,
        avgScore:
          p.allScores.length > 0
            ? p.allScores.reduce((a: number, b: number) => a + b, 0) /
              p.allScores.length
            : 0,
      }));

      stats.sort((a, b) => b.totalPoints - a.totalPoints);

      this.seasonWinners = seasonWinners;
      this.playerStats = stats;
      this.records = this.buildRecords(stats, seasonMargins, eraMultiplier);
    },

    buildRecords(stats: any[], seasonMargins: any[], eraMultiplier: number) {
      if (!stats.length) return [];

      const maxBy = (key: string) =>
        stats.reduce((m, p) => (p[key] > m[key] ? p : m));
      const minBy = (key: string) =>
        stats.reduce((m, p) => (p[key] < m[key] ? p : m));

      const mostPoints = maxBy("totalPoints");
      const mostAdjustedPoints = maxBy("adjustedTotalPoints");
      const mostSeasonWins = maxBy("seasonWins");
      const mostRaceWins = maxBy("raceWins");
      const bestRace = maxBy("bestRaceScore");
      const bestSeason = maxBy("bestSeasonTotal");
      const highestAvg = maxBy("avgScore");
      const lowestAvg = minBy("avgScore");

      return [
        {
          label: "Most Points Overall",
          holder: mostPoints.player,
          colour: mostPoints.colour,
          value: mostPoints.totalPoints.toLocaleString(),
          context: null,
        },
        {
          label: "Most Points Overall (Adjusted)",
          holder: mostAdjustedPoints.player,
          colour: mostAdjustedPoints.colour,
          value: Math.round(
            mostAdjustedPoints.adjustedTotalPoints
          ).toLocaleString(),
          context: `×${eraMultiplier.toFixed(2)} applied to pre-2024 seasons`,
        },
        {
          label: "Most Seasons Won",
          holder: mostSeasonWins.player,
          colour: mostSeasonWins.colour,
          value: `${mostSeasonWins.seasonWins} season${
            mostSeasonWins.seasonWins !== 1 ? "s" : ""
          }`,
          context: null,
        },
        {
          label: "Most Race Wins",
          holder: mostRaceWins.player,
          colour: mostRaceWins.colour,
          value: `${mostRaceWins.raceWins} wins`,
          context: null,
        },
        {
          label: "Highest Single Race Score",
          holder: bestRace.player,
          colour: bestRace.colour,
          value: bestRace.bestRaceScore.toLocaleString(),
          context: bestRace.bestRaceYear.toString(),
        },
        {
          label: "Highest Season Total",
          holder: bestSeason.player,
          colour: bestSeason.colour,
          value: bestSeason.bestSeasonTotal.toLocaleString(),
          context: bestSeason.bestSeasonYear.toString(),
        },
        {
          label: "Highest Average Per Race",
          holder: highestAvg.player,
          colour: highestAvg.colour,
          value: highestAvg.avgScore.toFixed(1),
          context: null,
        },
        {
          label: "Lowest Average Per Race",
          holder: lowestAvg.player,
          colour: lowestAvg.colour,
          value: lowestAvg.avgScore.toFixed(1),
          context: null,
        },
        ...(() => {
          if (!seasonMargins.length) return [];
          const biggest = seasonMargins.reduce((m, s) =>
            s.margin > m.margin ? s : m
          );
          const smallest = seasonMargins.reduce((m, s) =>
            s.margin < m.margin ? s : m
          );
          return [
            {
              label: "Biggest Winning Margin",
              holder: biggest.player,
              colour: biggest.colour,
              value: `${biggest.margin.toLocaleString()} pts`,
              context: biggest.year.toString(),
            },
            {
              label: "Smallest Winning Margin",
              holder: smallest.player,
              colour: smallest.colour,
              value: `${smallest.margin.toLocaleString()} pts`,
              context: smallest.year.toString(),
            },
          ];
        })(),
      ];
    },
  },
};
</script>

<style scoped lang="scss">
.hall-of-fame {
  text-align: left;
}

.colour-bar {
  display: inline-block;
  width: 4px;
  height: 16px;
  border-radius: 2px;
  vertical-align: middle;
}

table th {
  color: #17b06b;
}

.season-badge {
  background-color: #2b3035;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  text-align: center;
  min-width: 90px;

  .season-year {
    font-size: 0.75rem;
    color: #adb5bd;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }

  .season-player {
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .season-total {
    font-size: 0.85rem;
    color: #adb5bd;
  }
}

.standing-card {
  background-color: #2b3035;
  border-radius: 0.5rem;
  overflow: hidden;

  .standing-card-header {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    .standing-position {
      font-size: 0.85rem;
      min-width: 1.25rem;
    }

    .standing-name {
      font-weight: bold;
      font-size: 1rem;
    }

    .standing-total {
      font-size: 1rem;
      color: #fff;
    }
  }

  .standing-card-body {
    padding: 0.5rem 0;
  }

  .standing-stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 1rem;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .standing-stat-label {
      font-size: 0.8rem;
      color: #17b06b;
      font-weight: bold;
    }

    .standing-stat-value {
      font-size: 0.9rem;
      color: #fff;
      text-align: right;
    }
  }
}

.record-card {
  background-color: #2b3035;
  border-radius: 0.5rem;
  padding: 1rem;
  height: 100%;

  .record-label {
    font-size: 0.75rem;
    color: #adb5bd;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .record-holder {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }

  .record-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 0.25rem;
  }

  .record-context {
    font-size: 0.8rem;
    color: #6c757d;
  }
}
</style>
