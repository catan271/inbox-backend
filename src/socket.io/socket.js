import authenticate from './auth.js'
import { seen, send } from './message.js'

const users = {}

const socketHandler = (io) => (socket) => {
    socket.on('join', async (token, callback) => {
        try {
            const user = await authenticate(token)
            users[socket.id] = user.toJSON()
            socket.join(user._id.toString())
        } catch (e) {
            callback(e)
        }
    })

    socket.on('messageSent', ({ content, to }, callback) => {
        if (users[socket.id]) {
            io.to(to).emit('newMessage', {
                from: users[socket.id],
                content
            })
            send(users[socket.id]._id, to, content, callback)
        }
    })

    socket.on('seen', (to, callback) => {
        if (users[socket.id]) {
            setTimeout(() => seen(users[socket.id]._id, to, callback), 1000)
        }
    })

    socket.on('disconnect', () => {
        delete users[socket.id]
    })
}

export default socketHandler