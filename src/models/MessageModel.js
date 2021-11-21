import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'chat'
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    content: {
        type: String,
        required: true
    },
    time: {
        type: Object,
        
    }
})

messageSchema.methods.toJSON = function() {
    return ({
        from: this.from,
        content: this.content,
        time: this.time
    })
}

const Chat = mongoose.model('message', messageSchema)

export default Chat