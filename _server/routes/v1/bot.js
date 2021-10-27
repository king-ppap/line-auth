import express from 'express';
import LineController from '../../controllers/bot/line-controller.js';

const router = express.Router();

router.post('/line/send', LineController.sendMessageLineController);
router.post('/line/profile', LineController.getUserLineProfileController);
router.post('/line/followers', LineController.getBotFollowersIdsController);
// router.post('/login', authController.loginController)
// router.post('/info', authController.authInfoController)

// router.get('/token/:token', authController.loginWebTeamController)

export default router;
