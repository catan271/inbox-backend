import Chat from "../models/ChatModel.js"
import Message from '../models/MessageModel.js'
import User from "../models/UserModel.js"

const getChat = async (from, to) => {
    if (from == to) throw new Error('Cannot send message to yourself')
    if (!(await User.findById(from)) || !(await User.findById(to))) throw new Error('User not found')
    let chat = await Chat.findOne({members: {$all: [from, to]}})
    if (!chat) {            
        chat = new Chat({
            members: [from, to]
        })
    }
    return chat
}

export const send = async (req, res, next) => {
    try {
        const from = req.user._id
        const { to, content } = req.body

        const chat = await getChat(from, to)

        const time = new Date()
        const message = (new Message({
            chat: chat._id,
            from,
            content,
            time
        }))

        chat.last = {
            from,
            content,
            time
        }
        chat.seen = false

        await message.save()
        await chat.save()

        res.send(message)
    } catch(e) {
        next(e)
    }        
}

export const getAllChats = async (req, res, next) => {
    try {
        await req.user.populate({
            path: 'chats',
            options: {
                sort: {
                    'last.time': -1
                }
            }
        })

        const chats = req.user.chats
        const contacts = []
        for (let i = 0; i < chats.length; i++) {
            let id = chats[i].members[0]
            if (id.toString() == req.user._id.toString()) id = chats[i].members[1]
            try {
                const other = await User.findById(id)
                if (other) contacts.push({chat: chats[i], other })
            } catch (e) {console.log(e)}
        }
        res.send(contacts)
    } catch(e) {
        next(e)
    }
}

export const getOneChat = async (req, res, next) => {
    try {
        const from = req.user._id, to = req.params.to
        const chat = await getChat(from, to)
        if (!chat.seen && chat.last.from && chat.last.from.toString() != from.toString()) {
            chat.seen = true
            await chat.save()
        }
        await chat.populate({
            path: 'messages',
            options: {
                sort: {
                    time: -1
                },
                limit: 50,
                skip: Number.parseInt(req.query.skip || '0')
            }
        })

        
        let id = chat.members[0]
        if (id.toString() == req.user._id.toString()) id = chat.members[1]
        const other = await User.findById(id)

        res.send({other, messages: chat.messages})
    } catch(e) {
        next(e)
    }
}