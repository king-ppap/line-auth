const express = require('express')
const router = express.Router()

const cors = require('cors')
const whitelist = [
  'line.kingonhuy.local'
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
router.use('/v1', require('./v1'))

// 404
router.use(function (req, res, next) {
  return res.status(404).send({ code: '404', message: 'URL Not found.' });
});

// 500 - Any server error
router.use(function (err, req, res, next) {
  return res.status(500).send({ error: err });
});


module.exports = router