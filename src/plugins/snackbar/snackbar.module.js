const snackbar = {
  namespaced: true,
  state: {
    message: null,
    colorSnack: null,
    colorBtn: null,
    timeout: 5000,
    multiLine: false,
    action: null,
    actionText: null,
  },
  mutations: {
    /**
     * Show snackbar
     * @param {Object} state
     * @param {Object} data
     * @param {String} data.message
     * @param {String} data.colorSnack
     * @param {String} data.colorBtn
     * @param {Number} data.timeout
     * @param {Boolean} data.multiLine
     * @param {Function} data.action
     * @param {String} data.actionText
     */
    showMessage(state, data) {
      const { message, colorSnack, colorBtn, timeout, multiLine, action, actionText } = data;
      state.message = message;
      state.colorSnack = colorSnack;
      state.colorBtn = colorBtn;
      state.timeout = timeout;
      state.multiLine = multiLine;
      state.action = action;
      state.actionText = actionText;
    },
  },
};

export default snackbar;
