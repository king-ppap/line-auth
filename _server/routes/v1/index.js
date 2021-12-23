import express from 'express';
// const { authenticateToken } = require('../../middleware/auth');

const router = express.Router()

import auth from './auth.js';
import bot from './bot.js';
import user from './user.js';

router.use('/auth', auth);
router.use('/bot', bot);
router.use('/user', user);

router.get('/ok', (req, res) => {
	res.send('V1 OK');
});

export default router;
