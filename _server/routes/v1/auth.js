import express from 'express';
import AuthController from '../../controllers/auth/auth-controller.js';

const router = express.Router();

router.post('/line', AuthController.authLineController);
router.post('/firebase/line', AuthController.authLineFirebaseController);

export default router;
