import express from 'express'

import { getAllChats, getOneChat, send } from '../controllers/ChatController.js'
import auth from '../services/auth.js'

const chatRouter = express.Router()

chatRouter.post('/chat/send', auth, send)
chatRouter.get('/chat/all', auth, getAllChats)
chatRouter.get('/chat/:to', auth, getOneChat)

export default chatRouter