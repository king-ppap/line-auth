<template>
  <br />
  <button @click="logout" :disabled="!isLogin">Logout</button>
  <hr />
  <div v-if="!isLogin">
    <p>Create Email</p>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="createEmail">Crate and Login</button>

    <p>Login Email</p>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="loginEmail">Login</button>
    <button @click="sendPasswordResetEmail">Reset password</button>

    <p>Login (Popup)</p>
    <button @click="loginProviders('facebook.com')">Facebook</button>
    <button @click="loginProviders('github.com')">Github</button>
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
    <div>
      <input v-model="newPhoneNumber" placeholder="New phone number" />
      <button @click="updatePhoneNumber">Ok</button>
    </div>

    <hr width="500px" />
    <button @click="sendVerifyEmail" :disabled="!isLogin">SendEmailVerification</button>
    <div>
      <input v-model="newPassword" placeholder="New password" :disabled="!isLogin" />
      <button @click="updatePassword" :disabled="!isLogin">Update Password</button>
    </div>
    <hr width="500px" />
    <div v-for="(value, key) in providerList" :key="key" style="display: flex;">
      <button @click="linkProviders(value)" :disabled="!isLogin">Link {{ key }}</button>
      <button @click="unlinkProviders(value)" :disabled="!isLogin">Unlink {{ key }}</button>
    </div>
    <textarea style="width: 100%; height: 300px;" v-model="profileData" disabled></textarea>
    <hr width="500px" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  GithubAuthProvider,
  FacebookAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  linkWithPopup,
  unlink,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updatePassword,
  sendPasswordResetEmail,
  PhoneAuthProvider,
  updatePhoneNumber,
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
      email: "",
      nEmail: "",
      password: "",
      newPassword: "",
      isLogin: false,
      isRecaptchaInited: false,
      recaptchaVerifier: {} as RecaptchaVerifier,
      phoneNumber: "+66888888888",
      newPhoneNumber: "",
      confirmationResult: {} as any,
      otpInput: "888888",
      providerList: {
        "Facebook": "facebook.com",
        "Github": "github.com",
        "Phone": "phone",
        "Password": "password",
      },
    };
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
    // https://firebase.google.com/docs/reference/js/v8/firebase.User#updatephonenumber
    // https://firebase.google.com/docs/reference/js/v8/firebase.auth.PhoneAuthProvider
    async updatePhoneNumber() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const provider = new PhoneAuthProvider(auth);
        const recaptchaApp = await this.initRecaptcha();
        const phoneCredential = await provider.verifyPhoneNumber(this.newPhoneNumber, recaptchaApp)
          .then((verificationId) => {
            var verificationCode = window.prompt('Please enter the verification ' +
              'code that was sent to your mobile device.');
            return PhoneAuthProvider.credential(verificationId,
              verificationCode || "");
          });
        await updatePhoneNumber(user, phoneCredential);
      }
    },
    confirmOTP() {
      // https://firebase.google.com/docs/auth/web/phone-auth#send-a-verification-code-to-the-users-phone
      console.log(this.otpInput, this.confirmationResult);
      this.confirmationResult.confirm(this.otpInput)
        .then((data: any) => {
          console.log("confirmOTP", data);
        })
        .catch((error: any) => {
          console.error("confirmOTP", error);
        })
        .finally(() => {
          console.log("recaptchaVerifier.clear");
          this.recaptchaVerifier.clear();
        });

      // const credential = PhoneAuthProvider.credential(this.confirmationResult.verificationId, this.otpInput);
      // signInWithCredential(getAuth(), credential)
      //   .then((data) => {
      //     console.log("confirmOTP", data);
      //   })
      //   .catch((error) => {
      //     console.error("confirmOTP", error);

      //   })
      //   .finally(() => {
      //     console.log("recaptchaVerifier.clear");
      //     this.recaptchaVerifier.clear();
      //   });
    },
    async createEmail() {
      const auth = getAuth();
      this.loginData = await createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          this.profile = user;
          return userCredential;
        })
        .catch((error) => {
          this.profile = {};
          return error;
        });
    },
    async loginEmail() {
      // https://firebase.google.com/docs/auth/web/password-auth#create_a_password-based_account
      const auth = getAuth();
      this.loginData = await signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          this.profile = user;
          return userCredential;
        })
        .catch((error) => {
          this.profile = {};
          return error;
        });

    },
    sendPasswordResetEmail() {
      const auth = getAuth();
      sendPasswordResetEmail(auth, this.email)
        .then(() => {
          // Password reset email sent!
          console.log("Password reset email sent!");
        })
        .catch((error) => {
          console.error(error);
        });
    },
    sendVerifyEmail() {
      // https://firebase.google.com/docs/auth/web/manage-users#send_a_user_a_verification_email
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        sendEmailVerification(user)
          .then(() => {
            // Email verification sent!
            console.log("Email send !!!");
          });
      }
    },
    updatePassword() {
      // https://firebase.google.com/docs/auth/web/manage-users#set_a_users_password
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        updatePassword(user, this.newPassword)
          .then(() => {
            // Update successful.
            console.log("Update Password successful");
          }).catch((error) => {
            // https://firebase.google.com/docs/reference/js/v8/firebase.User#updateemail
            console.error(error);
          });
      }
    },
    getProviderObj(name: string): any {
      switch (name) {
        case "github.com":
          return new GithubAuthProvider();
        case "facebook.com":
        default:
          return new FacebookAuthProvider();
      }
    },
    async loginProviders(providerName: string) {
      console.log(`Login ${providerName}`);
      const providerObj = this.getProviderObj(providerName);
      // https://developers.facebook.com/docs/graph-api/reference/user/#default-public-profile-fields
      // providerObj.addScope("public_profile");

      const auth = getAuth();
      this.loginData = await signInWithPopup(auth, providerObj)
        .then((result) => {
          // The signed-in user info.
          const user = result.user;
          this.profile = user;
          console.log(user);

          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          // const credential = providerObj.credentialFromResult(result);
          // const accessToken = credential?.accessToken;
          // console.log(accessToken);
          return {
            // credential,
            // accessToken,
            user,
          };
        })
        .catch((error) => {
          console.warn(`Error Login ${providerName}`, error);
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          // const credential = providerObj.credentialFromError(error);
          return {
            errorCode,
            errorMessage,
            email,
            // credential,
          };
        });
    },
    linkProviders(providerName: string) {
      // https://firebase.google.com/docs/auth/web/account-linking
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const providerObj = this.getProviderObj(providerName);

      if (currentUser)
        linkWithPopup(currentUser, providerObj).then((result) => {
          // Accounts successfully linked.
          // const credential = FacebookAuthProvider.credentialFromResult(result);
          // console.log(credential);
          console.log(result.user);

          this.profile = result.user;
        }).catch((error) => {
          // Handle Errors here.
          console.error(error);
        });
    },
    unlinkProviders(name: string) {
      const auth = getAuth();
      if (auth.currentUser) {
        unlink(auth.currentUser, name)
          .then((data) => {
            this.profile = data;
            console.log(`Unlinked ${name} !!!`, data);
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