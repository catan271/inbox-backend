import mongoose from 'mongoose'

let conn = null

export const connect = async () => {
    if (conn == null) {
        conn = mongoose.connect(process.env.MONGODB_STRING,{
            serverSelectionTimeoutMS: 5000
        }).then(() => {
            console.log('database connect')
            return mongoose
        })

        await conn
    }

    return conn
}