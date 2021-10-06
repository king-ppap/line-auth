const express = require('express')
const cors = require("cors")

const { errorHandler } = require('./controllers/error-controller')
require('dotenv').config()
const bodyParser    = require('body-parser')

const app = express()
try {
	app.use(cors());
	app.use(bodyParser.json({limit:'25mb'}))                       //ปรับขนาด upload file | Defaults to '100kb'
	app.use(bodyParser.urlencoded({extended:true, limit:'25mb'}))
	
	app.use('/', require('./routes'))
	app.use(errorHandler)
} catch (error) {
	console.log('ei',error);
}



module.exports = app