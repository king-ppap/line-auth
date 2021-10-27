import FirebaseAdmin from "firebase-admin";
// import serviceAccount from "../key/firebase.json";

import fs from 'fs';

const serviceAccount = fs.readFileSync('../key/firebase.json');
console.log(serviceAccount);
FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount),
});

export default FirebaseAdmin;
