import express from 'express';
import UserController from '../../controllers/user-controller.js';

const router = express.Router();

router.post('/phone', UserController.updateUserPhoneNumberController);

export default router;
