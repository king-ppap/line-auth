import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCPL1XgLv4nAYApbaQZ_gGBVeEt2xVqV4",
  authDomain: "test-add25.firebaseapp.com",
  projectId: "test-add25",
  storageBucket: "test-add25.appspot.com",
  messagingSenderId: "320510834988",
  appId: "1:320510834988:web:610dcaa648a177e17a1489",
  measurementId: "G-0N2XENHD9R"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
auth.languageCode = 'th';

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
