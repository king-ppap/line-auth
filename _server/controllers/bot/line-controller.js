const { expressHandler } = require('../express-handler')

const LineService = require('../../services/bot/line-service')

async function sendMessageLineController(request) {
  return await LineService.sendMessageLineService(request);
};

async function getUserLineProfileController(request) {
  return await LineService.getUserLineProfileService(request);
};

async function getBotFollowersIdsController(request) {
  return await LineService.getBotFollowersIdsService(request);
}

module.exports = {
  sendMessageLineController: expressHandler({
    handler: sendMessageLineController
  }),
  getUserLineProfileController: expressHandler({
    handler: getUserLineProfileController
  }),
  getBotFollowersIdsController: expressHandler({
    handler: getBotFollowersIdsController
  }),
};
