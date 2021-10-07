<template>
  <a
    href="https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1656499349&redirect_uri=http://line.kingonhuy.local:8080/auth/line&state=12345abcde&scope=profile%20openid&bot_prompt=aggressive"
  >Login</a>
  <h1>Line</h1>
  <a
    href="https://developers.line.biz/en/docs/line-login/integrate-line-login/#making-an-authorization-request"
  >Authenticating users and making authorization requests</a>
  <br />
  <a href="https://developers.line.biz/en/docs/line-login/integrate-line-login/#scopes">Scopes</a>
  <br />
  <a
    href="https://developers.line.biz/en/docs/line-login/integrate-pkce/"
  >PKCE support for LINE Login</a>
  <br />
  <a
    href="https://developers.line.biz/en/docs/line-login/link-a-bot/#redirect-users/"
  >Redirect users to the LINE Login authorization URL with the bot_prompt query parameter</a>
  <hr />
  <textarea style="width: 350px; height: 140px;">{{ fromLine }}</textarea>
  <hr />
  <div v-if="isLoading">Loading . . .</div>
  <div v-else>
    <textarea style="width: 500px; height: 500px;">{{ loginData }}</textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  data() {
    return {
      error: "",
      loginData: {},
      isLoading: false,
    }
  },
  computed: {
    fromLine(): string {
      return JSON.stringify(this.$route.query, null, 4);
    },
  },
  async created() {
    const grantCode = this.$route.query.code;
    const state = this.$route.query.state;
    if (grantCode) {
      this.loginData = await this.callbackToBackend(grantCode + "", state + "");
    }
  },
  methods: {
    callbackToBackend(code: string, state: string) {
      this.isLoading = true;
      return axios.post("http://line.kingonhuy.local:3000/v1/auth/line", {
        code,
        state,
      }).then((response) => {
        return response.data;
      }).catch((error) => {
        this.error = error.response.data;
        return error.response.data;
      }).finally(() => {
        this.isLoading = false;
      })
    },
  }
});
</script>