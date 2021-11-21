import express, { json } from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import mongoose from 'mongoose'

import userRouter from './routers/UserRouter.js'
import chatRouter from './routers/ChatRouter.js'

// initial config
config()
const port = process.env.PORT || 4000;
const app = express()
app.use(cors())
app.use(express.json())

// database connect
mongoose.connect(process.env.MONGODB_STRING)
    .then(() => console.log('Database connected'))
    .catch((e) => console.log(e))


// routers
app.get('/', (req, res) => {
    res.send('API home')
})

app.use(userRouter)
app.use(chatRouter)

app.use((e, req, res, next) => res.status(400).send({error: e.message}))

app.listen(port, () => {
    console.log('server listening on port', port);
})