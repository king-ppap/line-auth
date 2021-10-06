<template>
  <h1>Line</h1>
  <a
    href="https://developers.line.biz/en/docs/line-login/integrate-line-login/#making-an-authorization-request"
  >Authenticating users and making authorization requests</a>
  <br />
  <a href="https://developers.line.biz/en/docs/line-login/integrate-line-login/#scopes">Scopes</a>
  <br />
  <a href="https://developers.line.biz/en/docs/line-login/integrate-pkce/">PKCE support for LINE Login</a>
  <br />
  <a href="https://developers.line.biz/en/docs/line-login/link-a-bot/#redirect-users/">Redirect users to the LINE Login authorization URL with the bot_prompt query parameter</a>
  <hr />
  <textarea style="width: 500px; height: 500px;">{{ fromLine }}</textarea>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      test: "asdf",
    }
  },
  computed: {
    fromLine(): string {
      return JSON.stringify(this.$route.query, null, 4);
    },
  }
});
</script>