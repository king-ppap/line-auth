const axios = require("axios");

async function authLineService(request) {
  console.log("authLineService");
  const {
    grant_type,
    code,
    redirect_uri,
    client_id,
    client_secret,
    // TODO PKCE
  } = request.body

  console.log(request.body);

  return await axios.post("https://api.line.me/oauth2/v2.1/token", {
    grant_type,
    code,
    redirect_uri,
    client_id,
    client_secret,
  }).then((response) => {
    return response.data;
  })
}

module.exports = {
  authLineService
}