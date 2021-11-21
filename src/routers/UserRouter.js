import express from 'express'

import { findUser, getProfile, login, logout, logoutAll, register } from '../controllers/UserController.js'
import auth from '../services/auth.js'

const userRouter = new express.Router()

userRouter.post('/users/register', register)
userRouter.post('/users/login', login)
userRouter.get('/users/me', auth, getProfile)
userRouter.get('/users/logout', auth, logout)
userRouter.get('/users/logout-all', auth, logoutAll)

userRouter.get('/users/find', auth, findUser)

export default userRouter
