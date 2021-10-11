const { expressHandler } = require('../express-handler')

// const jwt = require('jsonwebtoken')
// const ConnectDB = require('../database').connectionFoodStory
const LineService = require('../../services/bot/line-service')

async function sendMessageLineController(request) {
  return await LineService.sendMessageLineService(request);
};

module.exports = {
  // loginController: expressHandler({
  //     handler: loginController
  // }),
  sendMessageLineController: expressHandler({
    handler: sendMessageLineController
  }),
  // loginWebTeamController: expressHandler({
  //     handler: loginWebTeamController
  // }),
};
