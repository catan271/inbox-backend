import express from 'express'

import { getAllChats, getOneChat, send } from '../controllers/ChatController.js'
import auth from '../services/auth.js'

const chatRouter = express.Router()

chatRouter.post('/chats/send', auth, send)
chatRouter.get('/chats/all', auth, getAllChats)
chatRouter.get('/chats/:to', auth, getOneChat)

export default chatRouter