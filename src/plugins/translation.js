import axios from "axios";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/config/translation";
import { i18n } from "@/plugins/vuei18n";

export const Translation = {
  get userLanguage() {
    return Translation.getLanguageCodeFromName(JSON.parse(localStorage.getItem('profile'))?.language);
  },
  get defaultLanguage() {
    return DEFAULT_LANGUAGE;
  },
  get supportedLanguages() {
    return SUPPORTED_LANGUAGES;
  },
  get currentLanguage() {
    return i18n.locale;
  },
  set currentLanguage(lang) {
    i18n.locale = lang;
  },
  getLanguageCodeFromName(name) {
    return Translation.supportedLanguages.find((e) => e.name === name)?.code;
  },
  getLanguageNameFromCode(code) {
    return Translation.supportedLanguages.find((e) => e.code === code)?.name;
  },
  /**
   * Gets the first supported language that matches the user"s
   * @return {String}
   */
  getUserSupportedLang() {
    const userPreferredLang = Translation.getUserLang();

    // Check if user preferred browser lang is supported
    if (Translation.isLangSupported(userPreferredLang.lang)) {
      return userPreferredLang.lang;
    }
    // Check if user preferred lang without the ISO is supported
    if (Translation.isLangSupported(userPreferredLang.langNoISO)) {
      return userPreferredLang.langNoISO;
    }
    return Translation.defaultLanguage;
  },
  /**
   * Returns the users preferred language
   */
  getUserLang() {
    const lang = Translation.userLanguage || window.navigator.language || window.navigator.userLanguage || Translation.defaultLanguage;
    return {
      lang: lang,
      langNoISO: lang.split("-")[0],
    };
  },
  /**
   * Sets the language to various services (axios, the html tag etc)
   * @param {String} lang
   * @return {String} lang
   */
  setI18nLanguageInServices(lang) {
    Translation.currentLanguage = lang;
    axios.defaults.headers.common["Accept-Language"] = lang;
    document.querySelector("html").setAttribute("lang", lang);
    return lang;
  },
  /**
   * Loads new translation messages and changes the language when finished
   * @param {String} lang
   * @return {Promise<any>}
   */
  async changeLanguage(lang) {
    if (!Translation.isLangSupported(lang)) return Promise.reject(new Error("Language not supported"))
    if (i18n.locale === lang) return Promise.resolve(lang) // has been loaded prior
    return Translation.loadLanguageFile(lang).then(msgs => {
      i18n.setLocaleMessage(lang, msgs.default || msgs)
      return Translation.setI18nLanguageInServices(lang)
    })
  },
  /**
   * Async loads a translation file
   * @param {String} lang
   * @return {Promise<*>|*}
   */
  loadLanguageFile(lang) {
    return import(/* webpackChunkName: "lang-[request]" */ `@/lang/${lang}.json`)
  },
  /**
   * Checks if a lang is supported
   * @param {String} lang
   * @return {boolean}
   */
  isLangSupported(lang) {
    return Translation.supportedLanguages.find((e) => e.code === lang);
  },
  /**
   * Checks if the route"s param is supported, if not, redirects to the first supported one.
   * @param {Route} to
   * @param {Route} from
   * @param {Function} next
   * @return {*}
   */
  routeMiddleware(to, from, next) {
    // Load async message files here
    const lang = to.params.lang;
    if (!Translation.isLangSupported(lang)) return next(Translation.getUserSupportedLang());
    return Translation.changeLanguage(lang).then(() => next());
  },
  /**
   * Returns a new route object that has the current language already defined
   * To be used on pages and components, outside of the main \ route, like on Headers and Footers.
   * @example <router-link :to="$i18nRoute({ name: "someRoute"})">Click Me </router-link>
   * @param {Object} to - route object to construct
   */
  i18nRoute(to) {
    return {
      ...to,
      params: { lang: Translation.currentLanguage, ...to.params },
    };
  },
}