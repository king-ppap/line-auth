import express from 'express';
import cors from "cors";

import dotenv from 'dotenv';
dotenv.config();

import errorHandler from './controllers/error-controller.js';

import bodyParser from 'body-parser';
import router from './routes/index.js';

import './libs/firebase.js';

const app = express();
try {
	app.use(cors());
	app.use(bodyParser.json({ limit: '25mb' })); //ปรับขนาด upload file | Defaults to '100kb'
	app.use(bodyParser.urlencoded({ extended: true, limit: '25mb' }));

	app.use('/', router);
	app.use(errorHandler);
} catch (error) {
	console.log(error.stack);
	console.log('Server Error: ', error);
}

export default app;
