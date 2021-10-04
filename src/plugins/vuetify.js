import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

const opts = {
  theme: {
    themes: {
      light: {
        primary: "#111f39",
        secondary: colors.red.lighten4,
        accent: colors.indigo.base,
      },
    },
  },
};

export default new Vuetify(opts);
