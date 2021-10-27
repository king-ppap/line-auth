import server from './server.js';

const port = process.env.PORT
server.listen(port, () => console.log(`App listening on port ${port}!`))
