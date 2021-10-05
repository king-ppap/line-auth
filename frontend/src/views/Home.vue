<template>
  <div class="home">
    <button>Lets go</button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
  },
})
export default class Home extends Vue {}
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>