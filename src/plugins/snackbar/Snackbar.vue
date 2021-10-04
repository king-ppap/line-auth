
<template>
  <v-snackbar
    v-model="show"
    :color="colorSnack"
    :timeout="timeout"
    :multi-line="multiLine"
  >
    <div v-html="message" />
    <template v-slot:action="{ attrs }">
      <v-btn text :color="colorBtn" @click="actionBtn" v-bind="attrs">{{
        actionText
      }}</v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: "",
      colorSnack: "",
      colorBtn: "",
      timeout: 5000,
      multiLine: false,
      actionText: "Close",
      action: null
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "snackbar/showMessage") {
        this.message = state.snackbar.message;
        this.colorSnack = state.snackbar.colorSnack;
        this.colorBtn = state.snackbar.colorBtn;
        this.timeout = state.snackbar.timeout;
        this.multiLine = state.snackbar.multiLine;
        this.actionText = state.snackbar.actionText;
        this.action = state.snackbar.action;
        this.show = true;
      }
    });
  },
  methods: {
    actionBtn() {
      if (typeof this.action === "function") {
        this.action();
      } else if (this.action !== null) {
        console.error("{ action } should be Function");
      }
      this.show = false;
    }
  }
};
</script>
