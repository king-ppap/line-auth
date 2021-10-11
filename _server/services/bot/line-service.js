const APIError = require('../../errors/api-error');
const line = require('@line/bot-sdk');

const client = new line.Client({
  channelAccessToken: process.env.BOT_LINE_CHANNEL_ACCESS_TOKEN,
});

async function sendMessageLineService(request) {
  const {
    to,
    message,
  } = request.body;
  const response = await client.pushMessage(to, message)
    .then((e) => {
      console.log(e);
      return {
        isSend: true,
      };
    })
    .catch((error) => {
      throw new APIError("InvalidRequestError", "Error on pushing message.", {
        isSend: false,
        error,
      });
    });
  return response;
}

module.exports = {
  sendMessageLineService,
}