import Vue from "vue";
import VueI18n from "vue-i18n";
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from "@/config/translation";
import th from "@/lang/th.json";

// import axios from "axios";
// import {
//   getChoiceIndex,
//   setDefaultChoiceIndexGet
// } from "@/util/i18n/choice-index-for-plural"

Vue.use(VueI18n);

const dateTimeFormats = {
  en: {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
    long: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
  },
  th: {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
    long: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
  },
};
// https://levelup.gitconnected.com/advanced-vue-js-internationalization-i18n-and-localization-l10n-using-vue-router-a94ecd83fecd
const opts = {
  dateTimeFormats,
  locale: DEFAULT_LANGUAGE, // set locale
  fallbackLocale: FALLBACK_LANGUAGE,
  messages: { th }, // set locale messages
};

export default new VueI18n(opts);
