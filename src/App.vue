<template>
  <v-app>
    <v-main>
      <router-view :key="$route.path" />
    </v-main>
    <snackbar />
  </v-app>
</template>

<script>
import Snackbar from "@/plugins/snackbar/Snackbar.vue";

export default {
  components: {
    Snackbar,
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Kanit");

$body-font-family: "Kanit";

.v-application {
  font-family: $body-font-family !important;
}
</style>
