import { expressHandler } from '../express-handler.js';

import LineService from '../../services/bot/line-service.js';

async function sendMessageLineController(request) {
  return await LineService.sendMessageLineService(request);
};

async function getUserLineProfileController(request) {
  return await LineService.getUserLineProfileService(request);
};

async function getBotFollowersIdsController(request) {
  return await LineService.getBotFollowersIdsService(request);
}

export default {
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
