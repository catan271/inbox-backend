import express, { json } from 'express'
import cors from 'cors'
import { config } from 'dotenv'

import { connect } from './db/mongoose'
import userRouter from './routers/UserRouter'
import chatRouter from './routers/ChatRouter'

// initial config
config()
const app = express()
app.use(cors())
app.use(express.json())

// database connect
connect()


// routers
app.get('/', (req, res) => {
    res.send('API home')
})

app.use(userRouter)
app.use(chatRouter)

app.use((e, req, res, next) => res.status(400).send({error: e.message}))

export default app