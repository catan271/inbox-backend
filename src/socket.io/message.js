import { getChat } from "../controllers/ChatController.js"
import Message from '../models/MessageModel.js'

export const send = async (from, to, content, callback) => {
    try {
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
    } catch(e) {
        callback(e)
    }        
}

export const seen = async (from, to, callback) => {
    try {
        const chat = await getChat(from, to)
        if (to != chat.last.from.toString()) return
        chat.seen = true
        await chat.save()
    } catch (e) {
        callback(e)
    }
}