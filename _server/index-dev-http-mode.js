const server = require('./server')
const https = require('https')

const port = process.env.PORT
const mode = process.env.MODE

if (mode === "http") {
  server.listen(port, () => console.log(`App listening on port ${port}!`))
} else if (mode === "https") {
  const fs = require('fs');
  const key = fs.readFileSync('./key/key.pem');
  const cert = fs.readFileSync('./key/cert.pem');

  serverHttps = https.createServer({ key: key, cert: cert }, server)
  serverHttps.listen(3000, () => console.log(`Listening on ${port} with https mode`))
} else {
  console.log('Please set "MODE" `http` or `https` in .env');
}