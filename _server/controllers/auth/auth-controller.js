import { expressHandler } from '../express-handler.js';

// const jwt = require('jsonwebtoken')
// const ConnectDB = require('../database').connectionFoodStory
import SsoAuth from '../../services/auth/sso.js';

async function authLineController(request) {
  return await SsoAuth.authLineService(request);
};

async function authLineFirebaseController(request) {
  return await SsoAuth.authLineFirebaseService(request);
};

export default {
  authLineController: expressHandler({
    handler: authLineController
  }),
  authLineFirebaseController: expressHandler({
    handler: authLineFirebaseController
  }),
};
