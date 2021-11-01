import APIError from '../../errors/api-error.js';
import Line from '@line/bot-sdk';
import axios from 'axios';
import qs from 'qs';

async function getAccessTokenLineService(request, id, secret) {
  const data = qs.stringify({
    grant_type: "client_credentials",
    client_id: id || process.env.AUTH_LINE_CLIENT_ID,
    client_secret: secret || process.env.AUTH_LINE_CLIENT_SECRET,
  });
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  };

  return await axios.post(
    "https://api.line.me/v2/oauth/accessToken",
    data,
    config,
  )
    .then((response) => {
      return response.data;
    }).catch((error) => {
      throw new APIError("InvalidRequestError", "Error: Get access Line token", error.response.data);
    });
}

async function sendMessageLineService(request) {
  let {
    to,
    message,
    id,
    secret,
  } = request.body;
  const channelAccessToken = await getAccessTokenLineService(request, id, secret);

  console.log(channelAccessToken);

  let client = new Line.Client({
    channelAccessToken: channelAccessToken.access_token,
  });

  console.log(request.body, message);
  if ((typeof message) != "object") {
    message = JSON.parse(message);
  }

  return await client.pushMessage(to, message)
    .then((e) => {
      console.log(e);
      return {
        isSend: true,
      };
    })
    .catch((error) => {
      console.error(error.stack);
      console.error(error.originalError);
      throw new APIError("InvalidRequestError", "Error: pushing message.", {
        isSend: false,
        error: error.originalError.response.data,
      });
    });
}

async function getUserLineProfileService(request) {
  const {
    userId,
    id,
    secret,
  } = request.body;
  const channelAccessToken = await getAccessTokenLineService(request, id, secret);

  console.log(channelAccessToken);

  let client = new Line.Client({
    channelAccessToken: channelAccessToken.access_token,
  });
  return await client.getProfile(userId)
    .then((profile) => {
      console.log(profile);
      return profile;
    })
    .catch((error) => {
      throw new APIError("InvalidRequestError", "Error: getting user Line profile.", {
        error: error.originalError.response.data,
      });
    });
}

async function getBotFollowersIdsService(request) {
  const {
    id,
    secret,
  } = request.body;
  const channelAccessToken = await getAccessTokenLineService(request, id, secret);

  let client = new Line.Client({
    channelAccessToken: channelAccessToken.access_token,
  });

  return await client.getBotFollowersIds()
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      throw new APIError("InvalidRequestError", "Error: get bot followers IDs.", {
        error: error.originalError.response.data,
      });
    });
}

export default {
  sendMessageLineService,
  getUserLineProfileService,
  getBotFollowersIdsService,
};
