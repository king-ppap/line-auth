<template>
  <p>https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1656499349&redirect_uri=https://sso.kingonhuy.local:8080/auth/line&state=12345abcde&scope=profile%20openid&bot_prompt=aggressive</p>
  <br />
  <br />
  <button v-if="!isLogin" @click="loginLine">Line with Line</button>
  <button v-else @click="logout">Logout</button>
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
  <textarea style="width: 350px; height: 140px;" v-model="fromLine"></textarea>
  <hr />
  <div v-if="isLoading">Loading . . .</div>
  <div v-else style="display: grid;">
    <div style="display: flex;">
      <textarea style="width: 50%; height: 500px;" v-model="showLoginData" disabled></textarea>
      <textarea style="width: 50%; height: 500px;" disabled>{{ buetyJson(firebaseUserData) }}</textarea>
    </div>
    <hr />
    <input v-model="userId" placeholder="User ID" />
    <input v-model="sendMsgLineWith.id" placeholder="Channel ID" />
    <input v-model="sendMsgLineWith.secret" placeholder="Channal secret" />
    <textarea style="height: 100px;" v-model="message" :disabled="loading.sedingMsg"></textarea>
    <button @click="sendLineMessage" :disabled="loading.sedingMsg">Sent</button>
    <br />
    <div v-if="isSend">Sended</div>
    <hr />
    <textarea style="height: 100px;" v-model="profileData" :disabled="loading.getUserLineProfile"></textarea>
    <button @click="getUserLineProfile" :disabled="loading.getUserLineProfile">Profile</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import {
  getAuth,
  signInWithCustomToken,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

interface LoginData {
  profile: {
    userId: string,
  },
  code: any,
}

export default defineComponent({
  data() {
    return {
      error: "",
      loginData: {} as LoginData,
      isLoading: false,
      message: `{
"type": "flex",
"altText": "ฮันแน่ KingOnHuy เอง",
"contents": {
  "type": "bubble",
  "direction": "ltr",
  "hero": {
    "type": "image",
    "url": "https://cdn.discordapp.com/emojis/719791654227410944.gif?size=240",
    "size": "full",
    "aspectRatio": "20:13",
    "aspectMode": "cover",
    "action": {
      "type": "uri",
      "label": "Line",
      "uri": "https://linecorp.com/"
    }
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "Brown Cafe",
        "weight": "bold",
        "size": "xl",
        "contents": []
      },
      {
        "type": "box",
        "layout": "baseline",
        "margin": "md",
        "contents": [
          {
            "type": "icon",
            "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
            "size": "sm"
          },
          {
            "type": "icon",
            "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
            "size": "sm"
          },
          {
            "type": "icon",
            "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
            "size": "sm"
          },
          {
            "type": "icon",
            "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
            "size": "sm"
          },
          {
            "type": "icon",
            "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png",
            "size": "sm"
          },
          {
            "type": "text",
            "text": "4.0",
            "size": "sm",
            "color": "#999999",
            "flex": 0,
            "margin": "md",
            "contents": []
          }
        ]
      },
      {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "margin": "lg",
        "contents": [
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Place",
                "size": "sm",
                "color": "#AAAAAA",
                "flex": 1,
                "contents": []
              },
              {
                "type": "text",
                "text": "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
                "size": "sm",
                "color": "#666666",
                "flex": 5,
                "wrap": true,
                "contents": []
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Time",
                "size": "sm",
                "color": "#AAAAAA",
                "flex": 1,
                "contents": []
              },
              {
                "type": "text",
                "text": "10:00 - 23:00",
                "size": "sm",
                "color": "#666666",
                "flex": 5,
                "wrap": true,
                "contents": []
              }
            ]
          }
        ]
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "vertical",
    "flex": 0,
    "spacing": "sm",
    "contents": [
      {
        "type": "button",
        "action": {
          "type": "uri",
          "label": "CALL",
          "uri": "https://linecorp.com"
        },
        "color": "#28C2F3FF",
        "height": "sm",
        "style": "primary",
        "gravity": "top"
      },
      {
        "type": "button",
        "action": {
          "type": "uri",
          "label": "WEBSITE",
          "uri": "https://linecorp.com"
        },
        "color": "#819EF1FF",
        "margin": "md",
        "style": "link"
      },
      {
        "type": "spacer"
      }
    ]
  },
  "styles": {
    "footer": {
      "backgroundColor": "#F4FBFFFF",
      "separatorColor": "#AA1414FF"
    }
  }
}
}`,
      isSend: false,
      profile: {},
      firebaseUserData: {},
      userId: "",
      loading: {
        sedingMsg: false,
        getUserLineProfile: false,
      },
      sendMsgLineWith: {
        id: "",
        secret: "",
      },
      isLogin: false,
    };
  },
  computed: {
    fromLine(): string {
      return JSON.stringify(this.$route.query, null, 4);
    },
    showLoginData(): string {
      return JSON.stringify(this.loginData, null, 4);
    },
    profileData(): string {
      return JSON.stringify(this.profile, null, 4);
    }
  },
  async mounted() {
    const grantCode = this.$route.query.code;
    const state = this.$route.query.state;
    if (grantCode) {
      this.loginData = await this.callbackToBackend(grantCode + "", state + "");
      if (this.loginData.profile?.userId) {
        this.userId = this.loginData.profile.userId;
      }
    }
    const auth = getAuth();
    auth.languageCode = 'th';

    const cssLog = "background: #222; color: #ff8d00";
    onAuthStateChanged(auth, (user) => {
      this.firebaseUserData = user ?? {};
      if (user) {
        console.log("%cLoged IN", cssLog);
        this.isLogin = true;
      } else {
        console.log("%cLoged OUT", cssLog);
        this.isLogin = false;
      }
      console.log(user);
    })
  },
  methods: {
    async logout() {
      await signOut(getAuth())
        .then(() => {
          console.log("Sign out !");
        }).catch((error) => {
          console.warn(error)
        });
    },
    buetyJson(data: any) {
      return JSON.stringify(data, null, 2);
    },
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

      return btoa(String.fromCharCode(...new Uint8Array(hashArray)));
    },
    async loginLine() {
      const codeVerifier = this.randomString(48);
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
          // client_id: "1656395956",
          redirect_uri: "https://sso.kingonhuy.local:8080/auth/line",
          scope: "profile openid email",
          bot_prompt: "aggressive",
          state: "test",
        }
      );
      console.warn(params.toString());

      window.open("https://access.line.me/oauth2/v2.1/authorize/?" + params, "_self")
    },
    async callbackToBackend(code: string, state: string) {
      this.isLoading = true;
      const codeVerifier = localStorage.getItem("codeVerifier");
      return await axios.post<any, any>(
        "https://localhost:3000/v1/auth/line",
        {
          code,
          state,
          code_verifier: codeVerifier,
        }
      )
        .then(async (response) => {
          const { data } = response;
          await signInWithCustomToken(getAuth(), data.firebaseToken)
            .then((data) => {
              console.log(data);
            })
            .catch((error) => {
              console.error("signInWithCustomToken", error);
            });
          return data;
        })
        .catch((error) => {
          this.error = error.response.data;
          return error.response.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    sendLineMessage() {
      let msg = JSON.parse(this.message);
      if (!this.userId) {
        console.error("No user id");
        return;
      }
      this.loading.sedingMsg = true;
      return axios.post("https://localhost:3000/v1/bot/line/send", {
        to: this.userId,
        message: msg,
        id: this.sendMsgLineWith.id,
        secret: this.sendMsgLineWith.secret,
      })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error(error.response.data);
        })
        .finally(() => {
          this.loading.sedingMsg = false;
        });
    },
    getUserLineProfile() {
      if (!this.userId) {
        console.error("No user id");
        return;
      }
      this.loading.getUserLineProfile = true;
      return axios.post("https://localhost:3000/v1/bot/line/profile", {
        userId: this.userId,
        id: this.sendMsgLineWith.id,
        secret: this.sendMsgLineWith.secret,
      })
        .then(response => {
          console.log(response.data);
          this.profile = response.data;
        })
        .catch(error => {
          console.error(error.response.data);
          this.profile = error.response.data;
        })
        .finally(() => {
          this.loading.getUserLineProfile = false;
        });
    },
  }
});
</script>