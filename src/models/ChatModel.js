import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }],
    last: {
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
            type: Date,
            required: true
        }
    },
    seen: {
        type: Boolean
    }
})

chatSchema.virtual('messages', {
    ref: 'message',
    localField: '_id',
    foreignField: 'chat'
})

chatSchema.methods.toJSON = function() {
    return {
        last: this.last,
        seen: this.seen
    }
}

const Chat = mongoose.model('chat', chatSchema)

export default Chat