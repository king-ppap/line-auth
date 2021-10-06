const express = require('express')
// const { authenticateToken } = require('../../middleware/auth');

const router = express.Router()

router.use('/auth', require('./auth'));

router.get('/ok', (req, res) => {
	res.send('V1 OK');
})

module.exports = router
