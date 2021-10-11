const express = require('express');
const router = express.Router();

const LineController = require('../../controllers/bot/line-controller');

router.post('/line/send', LineController.sendMessageLineController);
// router.post('/login', authController.loginController)
// router.post('/info', authController.authInfoController)

// router.get('/token/:token', authController.loginWebTeamController)

module.exports = router;
