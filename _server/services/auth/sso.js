const axios = require("axios");
const APIError = require('../../errors/api-error');

async function authLineService(request) {
  console.log("authLineService");
  const {
    code,
    // TODO PKCE
    // TODO State
  } = request.body;

  console.log(request.body);

  return await axios.post("https://api.line.me/oauth2/v2.1/token", {
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.AUTH_LINE_REDIRECT_URI,
    client_id: process.env.AUTH_LINE_CLIENT_ID,
    client_secret: process.env.AUTH_LINE_CLIENT_SECRET,
  }).then((response) => {
    return response.data;
  }).catch((error) => {
    throw new APIError("InvalidRequestError", "Error from Line API", error.response.data);
  })
}

module.exports = {
  authLineService
}