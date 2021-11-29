import jwt from 'jsonwebtoken'

import User from '../models/UserModel.js'

const authenticate = async (token) => {
    const decoded = jwt.decode(token, process.env.JWT_SECRET)
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

    if (!user) throw new Error()

    return user
}

export default authenticate