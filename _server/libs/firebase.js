import {
  initializeApp,
  applicationDefault,
} from "firebase-admin/app";

import admin from "firebase-admin";

// https://firebase.google.com/docs/admin/setup#initialize-sdk
// https://firebase.google.com/docs/firestore/quickstart#initialize

// import fs from 'fs';
// const serviceAccount = fs.readFileSync('./key/firebase.json');
// console.log(serviceAccount.toString('utf8'));
initializeApp({
  credential: admin.credential.cert('./key/firebase.json'),
});
// initializeApp({
//   credential: applicationDefault(),
// });

console.log("Initialize Firebase App");
