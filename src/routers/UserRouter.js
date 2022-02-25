import express from 'express'

import { findUser, getProfile, login, logout, logoutAll, register, updateUser } from '../controllers/UserController.js'
import auth from '../services/auth.js'

const userRouter = new express.Router()

userRouter.post('/user/register', register)
userRouter.post('/user/login', login)
userRouter.get('/user/me', auth, getProfile)
userRouter.get('/user/logout', auth, logout)
userRouter.get('/user/logout-all', auth, logoutAll)
userRouter.get('/user/find', auth, findUser)
userRouter.patch('/user/update', auth, updateUser)

export default userRouter
