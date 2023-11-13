const express = require('express')



const router = express.Router()

// login route
router.post('/login', (req, res) => {
    res.json({mssg: 'login user'})
})

// signup route
router.post('/signup', (req, res) => {
    res.json({mssg: 'signup user'})
})

module.exports = router