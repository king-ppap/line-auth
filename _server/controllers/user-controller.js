import { expressHandler } from './express-handler.js';

import UserService from '../services/user.service.js';

async function updateUserPhoneNumberController(request) {
  return await UserService.updateUserPhoneNumberService(request);
};


export default {
  updateUserPhoneNumberController: expressHandler({
    handler: updateUserPhoneNumberController
  }),
};
