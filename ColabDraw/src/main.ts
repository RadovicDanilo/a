import { createApp, nextTick } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import DarkReader from "darkreader";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(vuetify);
app.use(createPinia());
app.use(router);


app.mount("#app");

nextTick(() => {
  DarkReader.auto(
    {
      brightness: 100,
      contrast: 90,
      sepia: 10,
    },
    {
      invert: [],
      ignoreInlineStyle: [".pixel", ".canvas"],
      css: `
        .canvas, .canvas * {
          background-color: white !important;
          color: black !important;
        }
      `,
      ignoreImageAnalysis: [],
      disableStyleSheetsProxy: false,
    }
  );
});