const express = require('express');
const router = express.Router();

const AuthController = require('../../controllers/auth/auth-controller');

router.post('/line', AuthController.authLineController);
// router.post('/login', authController.loginController)
// router.post('/info', authController.authInfoController)

// router.get('/token/:token', authController.loginWebTeamController)

module.exports = router
