import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import i18n from "@/plugins/vuei18n";
import vuetify from "@/plugins/vuetify";
import "@/plugins/snackbar/snackbar.plugin";
import { Translation } from "@/plugins/translation";

Vue.config.productionTip = false;

Vue.prototype.$i18nRoute = Translation.i18nRoute.bind(Translation);

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
