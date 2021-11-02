<template>
  <br />
  <button @click="logout" :disabled="!isLogin">Logout</button>
  <hr />
  <div v-if="!isLogin">
    <button @click="loginFacebook">Login with Facebook (Popup)</button>
    <hr />
    <input type="text" placeholder="Phone number" v-model="phoneNumber" />
    <button @click="loginPhone">Login with Phone</button>
    <br />
    <p>{{ confirmationResult }}</p>
    <input type="text" placeholder="OTP" v-model="otpInput" />
    <button @click="confirmOTP">Confirm</button>
  </div>
  <hr />
  <div v-if="isLoading">Loading . . .</div>
  <div v-else style="display: grid;">
    <h4>Sign In Data</h4>
    <textarea style="width: 100%; height: 200px;" v-model="showLoginData" disabled></textarea>
    <hr width="500px" />
    <h4>Firebase User Data</h4>
    <button @click="linkFacebook" :disabled="!isLogin">Link Facebook</button>
    <button @click="unlinkFacebook" :disabled="!isLogin">Unlink Facebook</button>
    <textarea style="width: 100%; height: 300px;" v-model="profileData" disabled></textarea>
    <hr width="500px" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  FacebookAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  linkWithPopup,
  unlink,
} from "firebase/auth";

import axios from "axios";

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
      isLogin: false,
      isRecaptchaInited: false,
      recaptchaVerifier: {} as RecaptchaVerifier,
      phoneNumber: "+66888888888",
      confirmationResult: {} as any,
      otpInput: "888888",
    }
  },
  computed: {
    showLoginData(): string {
      return this.buetyJson(this.loginData);
    },
    profileData(): string {
      return this.buetyJson(this.profile);
    },
  },
  async mounted() {
    const auth = getAuth();
    auth.languageCode = 'th';

    const cssLog = "background: #222; color: #ff8d00";
    onAuthStateChanged(auth, (user) => {
      this.profile = user ?? {};
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
    buetyJson(data: any) {
      return JSON.stringify(data, null, 2);
    },
    async logout() {
      await signOut(getAuth())
        .then(() => {
          console.log("Sign out !");
        }).catch((error) => {
          console.warn(error)
        });
    },
    removeReCaptcha() {
      // document.querySelector('#recaptcha-element')?.replaceChildren();
      const recapchaElement = document.querySelector('#recaptcha-element') as any;
      if (recapchaElement) {
        recapchaElement.replaceChildren();
      }
    },
    async initRecaptcha() {
      const auth = getAuth();

      console.log("initRecaptcha isRecaptchaInited");
      if (this.isRecaptchaInited) {
        console.log("is Recaptcha Inited");
        // this.removeReCaptcha();
        this.recaptchaVerifier.render()
          .then((data) => {
            console.log(data);

          })
          .catch((error) => {
            console.error(error);

          });
        return this.recaptchaVerifier;
      }
      console.log("initRecaptcha");
      try {
        this.recaptchaVerifier = new RecaptchaVerifier('recaptcha-element', {
          'size': 'invisible',
          'callback': (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // onSignInSubmit();
            console.log("recaptchaVerifier", response);
          },
          'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            console.warn("recaptchaVerifier expired-callback");
          },
        }, auth);
        this.isRecaptchaInited = true;
      } catch (error) {
        console.error("initRecaptcha", error);
      }

      console.log("initRecaptcha");
      return this.recaptchaVerifier;
    },
    async loginPhone() {
      // Send SMS to user
      // https://firebase.google.com/docs/auth/web/phone-auth#send-a-verification-code-to-the-users-phone
      const auth = getAuth();
      console.log("recaptchaApp");
      const recaptchaApp = await this.initRecaptcha();
      console.log(this.phoneNumber);

      try {
        this.loginData = await signInWithPhoneNumber(auth, this.phoneNumber, recaptchaApp)
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            console.log("DONE PHONE");

            this.confirmationResult = confirmationResult;
            return confirmationResult;
          })
          .catch((error) => {
            // Error; SMS not sent
            console.warn("SMS not sent", error);
            return error;
          })
          .finally(() => {
            console.log("recaptchaVerifier.clear");
            // grecaptcha.reset();
            // this.removeReCaptcha();
            // this.recaptchaVerifier.clear();
          });
      } catch (error) {
        console.error("loginPhone", error);

      }

    },
    confirmOTP() {
      // https://firebase.google.com/docs/auth/web/phone-auth#get-the-intermediate-authcredential-object
      console.log(this.otpInput);

      const credential = PhoneAuthProvider.credential(this.confirmationResult.verificationId, this.otpInput);
      signInWithCredential(getAuth(), credential)
        .then((data) => {
          console.log("confirmOTP", data);
        })
        .catch((error) => {
          console.error("confirmOTP", error);

        })
        .finally(() => {
          console.log("recaptchaVerifier.clear");
          this.recaptchaVerifier.clear();
        });
    },
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
    linkFacebook() {
      // https://firebase.google.com/docs/auth/web/account-linking
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser)
        linkWithPopup(currentUser, new FacebookAuthProvider()).then((result) => {
          // Accounts successfully linked.
          const credential = FacebookAuthProvider.credentialFromResult(result);
          console.log(credential);
          console.log(result.user);

          this.profile = result.user;
        }).catch((error) => {
          // Handle Errors here.
          console.error(error);
        });
    },
    unlinkFacebook() {
      const auth = getAuth();
      if (auth.currentUser) {
        unlink(auth.currentUser, "facebook.com")
          .then((data) => {
            this.profile = data;
            console.log("Unlinked !!!", data);
          }).catch((error) => {
            console.error(error);
          });
      } else {
        console.warn("not log in yet");
      }
    },
  }
});
</script>