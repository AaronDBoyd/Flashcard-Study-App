const User = require('../models/userModel')
const Card = require('../models/cardModel')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d'})
}

// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body
    
    try {
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id)

        // grab cards that are not deleted for user to test passed cards
        const livingPassedCardIds = (await Card.find({})).map(c => c._id.toString()).filter(id => user.passedCardIds.includes(id))

        // update users passedCardIds array in db
        const updatedUser = {email, token, passedCardCount: user.passedCardCount, passedCardIds: livingPassedCardIds}
        await User.findByIdAndUpdate({_id: user._id}, {
            ...updatedUser
        })

        res.status(200).json({email, token, passedCardCount: user.passedCardCount, passedCardIds: livingPassedCardIds})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// signup user
const signupUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.signup(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token, passedCardCount: user.passedCardCount, passedCardIds: user.passedCardIds})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// update user
const updateUser = async (req, res) => {
    const id = req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No user found'})
    }

    const user = await User.findByIdAndUpdate({_id: id}, {
        ...req.body
    })

    if (!user) {
        return res.status(404).json({error: 'No user found'})
    }

    res.status(200).json(user)
}

module.exports = { loginUser, signupUser, updateUser }