import express, { json } from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { renderFile } from 'ejs'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { connect } from './db/mongoose.js'
import userRouter from './routers/UserRouter.js'
import chatRouter from './routers/ChatRouter.js'

// paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// initial config
config()
const app = express()
app.use(cors())
app.use(express.json())
app.set('view engine', 'html');
app.engine('html', renderFile);
app.set('views', path.join(__dirname, '../public'))

// database connect
connect()

// static
app.use(express.static('public'))
app.get('*', (req, res) => {
    res.render('index.html')
})

// routers
app.use(userRouter)
app.use(chatRouter)

app.use((e, req, res, next) => res.status(400).send({error: e.message}))

export default app