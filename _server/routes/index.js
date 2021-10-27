import express from 'express';
const router = express.Router()

import cors from 'cors';

const whitelist = [
  'https://sso.kingonhuy.local:8080',
]

let corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

router.use(cors(corsOptions))

import v1 from './v1/index.js';
router.use('/v1', v1);

// 404
router.use(function (req, res, next) {
  return res.status(404).send({ code: '404', message: 'URL Not found.' });
});

// 500 - Any server error
router.use(function (err, req, res, next) {
  return res.status(500).send({ error: err });
});


export default router;
