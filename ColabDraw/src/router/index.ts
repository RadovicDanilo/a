import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";
import Register from "../views/ViewRegister.vue";
import Login from "../views/ViewLogin.vue";
import Gallery from "../views/Gallery.vue";
import Draw from "../views/Draw.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/gallery",
      name: "gallery",
      component: Gallery,
    },
    {
      path: "/draw/",
      name: "draw",
      component: Draw,
    },
  ],
});

export default router;
