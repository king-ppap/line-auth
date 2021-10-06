const { expressHandler } = require('../express-handler')
// const jwt = require('jsonwebtoken')
// const ConnectDB = require('../database').connectionFoodStory
const SsoAuth = require('../../services/auth/sso')

function authLineController(request) {
  console.log(request);
  return SsoAuth.authLineService();
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
