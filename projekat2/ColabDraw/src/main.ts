import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "@mdi/font/css/materialdesignicons.css";
import DarkReader from "darkreader";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

DarkReader.auto(
  {
    brightness: 100,
    contrast: 90,
    sepia: 10,
  },
  {
    invert: [],
    ignoreInlineStyle: [".canvas"],
    css: "",
    ignoreImageAnalysis: [],
    disableStyleSheetsProxy: false,
  }
);
