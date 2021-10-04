import Vue from "vue";
import store from "@/store";

const snackbarPlugin = {
  install: (Vue, { store }) => {
    if (!store) {
      throw new Error("Please provide vuex store.");
    }

    Vue.prototype.$snackbar = {
      showMessage: ({
        message = "",
        colorSnack = "",
        colorBtn = "",
        timeout = 5000,
        multiLine = false,
        action = null,
        actionText = "Close",
      }) => {
        store.commit(
          "snackbar/showMessage",
          { message, colorSnack, colorBtn, timeout, multiLine, action, actionText },
          { root: true },
        );
      }
    };
  },
};

Vue.use(snackbarPlugin, { store })

// export default snackbarPlugin;