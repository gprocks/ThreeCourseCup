import { createRouter, createWebHashHistory } from "vue-router";
import SeasonView from "../views/SeasonView.vue";
import HallOfFame from "../components/HallOfFame.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: SeasonView },
    { path: "/hall-of-fame", component: HallOfFame },
  ],
});

export default router;
