import User from "../models/UserModel"

// controllers for user routers
export const register = async (req, res, next) => {
    try {
        const body = req.body
        body.familyName = body.familyName.trim()
        body.name = body.familyName + ' ' + body.givenName
        const user = new User(body)
        const token = await user.generateAuthToken()

        await user.save()
        res.status(201).send({user, token})
    } catch(e) {
        next(e)
    }
}

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await User.findByCredentials(username, password)
        const token = await user.generateAuthToken()

        await user.save()
        res.send({user, token})
    } catch(e) {
        next(e)
    }
}

export const getProfile = (req, res) => {
    res.send(req.user)
}

export const logout = async (req, res, next) => {
    try {
        const user = req.user
        user.tokens = user.tokens.filter(each => each.token != req.token)

        await user.save()
        res.send()
    } catch(e) {
        next(e)
    }
}

export const logoutAll = async (req, res, next) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send()
    } catch(e) {
        next(e)
    }
}

export const findUser = async (req, res, next) => {
    try {
        const myId = req.user._id
        const key = req.query.search.trim()
        const results = []

        if (key) {
            const byUsername = await User.findOne({username: key, _id: {$ne: myId}})
            if (byUsername) results.push(byUsername)
            
            const byName = await User.find({name: {$regex : key, $options: 'i'}, _id: {$ne: myId}}).limit(10)
            results.push(...byName)
        }

        res.send(results)
    } catch (e) {
        next(e)
    }
}