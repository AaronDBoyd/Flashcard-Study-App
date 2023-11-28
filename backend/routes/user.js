const express = require('express')
const requireAuth = require('../middleware/requireAuth')

// controller functions
const { loginUser, signupUser, updateUser } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// *** REQUIRE AUTH FOR BELOW ROUTES  ***
router.use(requireAuth)

// update user
router.patch('/', updateUser)

module.exports = router