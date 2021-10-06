const express = require('express')
const cors = require("cors")
require('dotenv').config()

const { errorHandler } = require('./controllers/error-controller')

const bodyParser = require('body-parser')

const app = express()
try {
	app.use(cors());
	app.use(bodyParser.json({ limit: '25mb' }))                       //ปรับขนาด upload file | Defaults to '100kb'
	app.use(bodyParser.urlencoded({ extended: true, limit: '25mb' }))

	app.use('/', require('./routes'))
	app.use(errorHandler)
} catch (error) {
	console.log(error.stack);
	console.log('Server Error: ', error);
}



module.exports = app