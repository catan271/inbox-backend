import http from 'http'
import { Server } from 'socket.io'

import app from './app.js'
import authenticate from './socket.io/auth.js'

export const server = http.createServer(app)
const port = process.env.PORT || 4000;

const io = new Server(server)

const users = {}

io.on('connection', (socket) => {
    socket.on('join', async (token, callback) => {
        try {
            const user = await authenticate(token)
            users[socket.id] = user.toJSON()
            socket.join(user._id.toString())
        } catch (e) {
            callback(e)
        }
    })

    socket.on('messageSent', ({ content, to }) => {
        if (users[socket.id]) io.to(to).emit('newMessage', {
            from: users[socket.id],
            content
        })
    })

    socket.on('disconnect', () => {
        delete users[socket.id]
    })
})

server.listen(port, () => {
    console.log('server listening on port', port)
})