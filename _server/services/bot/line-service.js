const APIError = require('../../errors/api-error');
const line = require('@line/bot-sdk');

const client = new line.Client({
  channelAccessToken: process.env.BOT_LINE_CHANNEL_ACCESS_TOKEN,
});

async function sendMessageLineService(request) {
  let {
    to,
    message,
  } = request.body;
  console.log(request.body, message);
  if ((typeof message) != "object") {
    message = JSON.parse(message);
  }

  const response = await client.pushMessage(to, message)
    .then((e) => {
      console.log(e);
      return {
        isSend: true,
      };
    })
    .catch((error) => {
      console.error(error.stack);
      console.error(error.originalError);
      throw new APIError("InvalidRequestError", "Error on pushing message.", {
        isSend: false,
        error: error.originalError.response.data,
      });
    });
  return response;
}

async function getUserLineProfileService(request) {
  let {
    userId,
  } = request.body;
  return await client.getProfile(userId)
    .then((profile) => {
      console.log(profile);
      return profile;
    })
    .catch((error) => {
      throw new APIError("InvalidRequestError", "Error on getting user Line profile.", {
        isSend: false,
        error: error.originalError.response.data,
      });
    });
}

module.exports = {
  sendMessageLineService,
  getUserLineProfileService,
}