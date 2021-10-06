
const authController = require('../../controllers/auth/auth-controller');
const express = require('express');
const router = express.Router();

router.post('/line', authController.authLineController);
// router.post('/login', authController.loginController)
// router.post('/info', authController.authInfoController)

// router.get('/token/:token', authController.loginWebTeamController)

module.exports = router
