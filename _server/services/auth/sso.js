import qs from 'qs';
import axios from "axios";

import APIError from '../../errors/api-error.js';

import FirebaseAdmin from '../../libs/firebase.js';

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

  // FirebaseAdmin.

    return {
    lineAccess,
      profile,
  };
};

async function authLineFirebaseService() {

}

export default  {
  authLineService,
  authLineFirebaseService,
};
