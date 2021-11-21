import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({    
    name: {
        type: String,
        required: true,
        trim: true,
    },
    givenName: {
        type: String,
        required: true,
        trim: true,
    },
    familyName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(str = "") {
            if (!/^[a-zA-Z0-9]+$/.test(str)) throw new Error('Username must not contain special characters')
        }
    },
    password: {
        type: String,
        required: true,
        validate(pass) {
            if (pass.length < 6) throw new Error('Password must be at least 6-character long')
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value < 0) throw new Error('Age must be a positive number')
        }
    },
    gender: {
        type: Number,
        enum: [0, 1, 2],
        required: true,
    },
    color: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        required: true,
    },
    avatar: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('chats', {
    ref: 'chat',
    localField: '_id',
    foreignField: 'members'
})

userSchema.methods.toJSON = function() {
    return {
        _id: this._id,
        name: this.name,
        givenName: this.givenName,
        familyName: this.familyName,
        username: this.username,
        gender: this.gender,
        color: this.color
    }
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})

    return token
}

//Hash the password before saving
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.statics.findByCredentials = async function(username, password) {
    const user = await User.findOne({username})

    if (!user) throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw new Error('Unable to login')

    return user
}

const User = mongoose.model('user', userSchema)

export default User