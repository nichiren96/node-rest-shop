const http = require('http')
const app = require('./src/app')
const port = process.env.PORT || 9201

const server = http.createServer(app)

server.listen(port, () => console.log(`Server listening on port ${port}`))