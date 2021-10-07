<template>
  <a
    href="https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1656499349&redirect_uri=http://line.kingonhuy.local:8080/auth/line&state=12345abcde&scope=profile%20openid&bot_prompt=aggressive"
  >Login</a>
  <br />
  <br />
  <button @click="loginLine">Line with Line</button>
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
    randomString(length: number) {
      // 43-128
      const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~";
      let result = "";
      for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    },
    base64UrlEncode(str: string) {
      return str
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    },
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
    async digestMessage(message: string) {
      const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
      if (!crypto.subtle) {
        console.error("Plz run with https");
        return "";
      }
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
      const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
      return hashHex;
    },
    async loginLine() {
      const codeVerifier = this.randomString(100);
      localStorage.setItem("codeVerifier", codeVerifier);

      const code_challenge = this.base64UrlEncode(
        await this.digestMessage(codeVerifier)
      );

      let params = new URLSearchParams(
        {
          code_challenge,
          code_challenge_method: "S256",
          response_type: "code",
          client_id: "1656499349",
          redirect_uri: "https://line.kingonhuy.local:8080/auth/line",
          scope: "profile openid",
          bot_prompt: "aggressive",
          state: "test",
        }
      );
      console.warn(params.toString());

      window.open("https://access.line.me/oauth2/v2.1/authorize/?" + params, "_self")
    },
    callbackToBackend(code: string, state: string) {
      this.isLoading = true;
      const codeVerifier = localStorage.getItem("codeVerifier");
      return axios.post("http://line.kingonhuy.local:3000/v1/auth/line", {
        code,
        state,
        code_verifier: codeVerifier,
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