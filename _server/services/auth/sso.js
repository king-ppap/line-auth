import qs from 'qs';
import axios from "axios";

import APIError from '../../errors/api-error.js';

import {
  getAuth,
} from 'firebase-admin/auth';
import {
  getFirestore,
} from "firebase-admin/firestore";

async function authLineService(request) {
  console.log("authLineService");
  const {
    code,
    code_verifier,
  } = request.body;

  console.log(request.body);

  const data = qs.stringify({
    grant_type: "authorization_code",
    code,
    code_verifier,
    redirect_uri: process.env.AUTH_LINE_REDIRECT_URI,
    client_id: process.env.AUTH_LINE_CLIENT_ID,
    client_secret: process.env.AUTH_LINE_CLIENT_SECRET,
  });
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  };

  console.log(data);

  const lineAccess = await axios.post(
    "https://api.line.me/oauth2/v2.1/token",
    data,
    config,
  ).then((response) => {
    return response.data;
  }).catch((error) => {
    throw new APIError("InvalidRequestError", "Error: Line token API", error.response.data);
  });

  console.log(lineAccess);

  const profile = await axios.get("https://api.line.me/v2/profile", {
    headers: {
      Authorization: `Bearer ${lineAccess.access_token}`,
    },
  })
    .then((response) => {
      return response.data;
    }).catch((error) => {
      throw new APIError("InvalidRequestError", "Error: Line v2 Profile API", error.response.data);
    });
  // https://stackoverflow.com/questions/40171663/linking-custom-auth-provider-with-firebase
  // https://firebase.google.com/docs/auth/admin/manage-users#create_a_user
  /*
  "profile": {
          "userId": "xxx",
          "displayName": "King คิง",
          "statusMessage": "(emoji)(emoji)(emoji)(emoji)(emoji)(emoji)",
          "pictureUrl": "https://profile.line-scdn.net/xxx"
      }
  */
  // Search for existing users in our database first.
  const db = getFirestore();
  const lineData = await db.doc(`users_line/line:${profile.userId}`).get()
    .then((data) => {
      return data.data();
    })
    .catch((error) => {
      throw new APIError("500", "Error: Cannot get user data from Firestore", error);
    });
  console.log(lineData);

  console.log(getAuth().app.name);

  let firebaseUser = "ฮั่นแน่ ลืมทำไรไปปาวอะเรา";
  if (lineData) {
    firebaseUser = await getAuth()
      .getUser(`line:${profile.userId}`)
      .then((data) => {
        return data;
      })
      .catch(async (error) => {
        if (error.code === "auth/user-not-found") {
          return await createFirebaseUserFromLineData(profile);
        } else {
          console.error(error);
          throw new APIError("500", "Error: Cannot get Firebase user data", error);
        }
      });
  } else {
    console.log("Create new User");
    firebaseUser = await createFirebaseUserFromLineData(profile);
    console.log("Done create");
  }

  // https://firebase.google.com/docs/auth/admin/create-custom-tokens#create_custom_tokens_using_the_firebase_admin_sdk
  const firebaseToken = await getAuth()
    .createCustomToken(firebaseUser.uid)
    // .createCustomToken(firebaseUser.uid, profile)
    .then((customToken) => {
      return customToken;
    })
    .catch((error) => {
      console.log('Error creating custom token:', error);
      throw new APIError("500", "Error: creating custom token Firebase", error);
    });

  return {
    lineAccess,
    profile,
    firebaseToken,
  };
};

async function createFirebaseUserFromLineData(userData, customUid) {
  let uid = customUid || `line:${userData.userId}`;
  console.log("createFirebaseUserFromLineData", uid);
  return await getAuth()
    .createUser({
      uid,
      displayName: userData.displayName,
      photoURL: userData.pictureUrl
    })
    .then(async (data) => {
      console.log(data);
      // https://retool.com/blog/crud-with-cloud-firestore-using-the-nodejs-sdk/
      await saveUserLineData(userData);
      return data;
    })
    .catch(async (error) => {
      switch (error.code) {
        case "auth/uid-already-exists":
          await saveUserLineData(userData);
          return { uid };
        default:
          console.error(error);
          throw new APIError("500", "Error: creating user Firebase", error);
      }
    });
}

async function saveUserLineData(userData) {
  const db = getFirestore();
  await db.collection("users_line")
    .doc(`line:${userData.userId}`)
    .set({
      ...userData,
    })
    .catch((error) => {
      getAuth().deleteUser(uid);
      throw new APIError("500", "Error: store data to Firestore", error);
    });
}

async function authLineFirebaseService() {

}

export default {
  authLineService,
  authLineFirebaseService,
};
