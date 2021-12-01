import http from 'http'
import { Server } from 'socket.io'

import app from './app.js'
import socketHandler from './socket.io/socket.js'

export const server = http.createServer(app)
const port = process.env.PORT || 4000;

const io = new Server(server)

io.on('connection', socketHandler(io))

server.listen(port, () => {
    console.log('server listening on port', port)
})