const server = require('./server')

const port = process.env.PORT
server.listen(port, () => console.log(`App listening on port ${port}!`))
