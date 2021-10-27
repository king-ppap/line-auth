<template>
  <br />
  <br />
  <button @click="loginFacebook">Login with Facebook (Popup)</button>
  <hr />
  <div v-if="isLoading">Loading . . .</div>
  <div v-else style="display: grid;">
    <textarea style="width: 500px; height: 500px;" v-model="showLoginData"></textarea>
    <hr />
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
      // provider.addScope("public_profile");

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
  }
});
</script>