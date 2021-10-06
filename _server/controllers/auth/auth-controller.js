const { expressHandler } = require('../express-handler')

// const jwt = require('jsonwebtoken')
// const ConnectDB = require('../database').connectionFoodStory
const SsoAuth = require('../../services/auth/sso')

async function authLineController(request) {
  return await SsoAuth.authLineService(request);
};

module.exports = {
  // loginController: expressHandler({
  //     handler: loginController
  // }),
  authLineController: expressHandler({
    handler: authLineController
  }),
  // loginWebTeamController: expressHandler({
  //     handler: loginWebTeamController
  // }),
};
