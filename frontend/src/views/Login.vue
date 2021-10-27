<template>
  <br />
  <br />
  <button @click="loginFacebook">Login with Facebook (Popup)</button>
  <hr />
  <textarea style="width: 350px; height: 140px;" v-model="fromLine"></textarea>
  <hr />
  <div v-if="isLoading">Loading . . .</div>
  <div v-else style="display: grid;">
    <textarea style="width: 500px; height: 500px;" v-model="showLoginData"></textarea>
    <hr />
    <input v-model="userId" placeholder="User ID" />
    <hr />
    <textarea style="height: 100px;" v-model="profileData" :disabled="loading.getUserLineProfile"></textarea>
    <button @click="getUserLineProfile" :disabled="loading.getUserLineProfile">Profile</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

import axios from "axios";

interface LoginData {
  profile: {
    userId: string,
  },
  code: any,
};

export default defineComponent({
  data() {
    return {
      error: "",
      loginData: {},
      isLoading: false,
      isSend: false,
      profile: {},
      userId: "",
      loading: {
        sedingMsg: false,
        getUserLineProfile: false,
      },
      sendMsgLineWith: {
        id: "",
        secret: "",
      },
    }
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
  // async mounted() {
  //   const grantCode = this.$route.query.code;
  //   const state = this.$route.query.state;
  //   if (grantCode) {
  //     this.loginData = await this.callbackToBackend(grantCode + "", state + "");
  //     if (this.loginData.profile?.userId) {
  //       this.userId = this.loginData.profile.userId;
  //     }
  //   }
  // },
  methods: {
    async loginFacebook() {
      console.log("Login Facebook");
      const provider = new FacebookAuthProvider();
      // https://developers.facebook.com/docs/graph-api/reference/user/#default-public-profile-fields
      provider.addScope("public_profile");
      provider.addScope("email");
      provider.addScope("user_birthday");
      provider.addScope("user_gender");

      const auth = getAuth();
      this.loginData = await signInWithPopup(auth, provider)
        .then((result) => {
          // The signed-in user info.
          const user = result.user;
          console.log(user);

          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          const credential = FacebookAuthProvider.credentialFromResult(result);
          const accessToken = credential?.accessToken;
          console.log(accessToken);
          return {
            credential,
            accessToken,
            user,
          };
        })
        .catch((error) => {
          console.log("Error login Facebook", error);
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = FacebookAuthProvider.credentialFromError(error);
          return {
            errorCode,
            errorMessage,
            email,
            credential,
          };
        });
    },
    callbackToBackend(code: string, state: string) {
      this.isLoading = true;
      const codeVerifier = localStorage.getItem("codeVerifier");
      return axios.post("https://localhost:3000/v1/auth/line", {
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