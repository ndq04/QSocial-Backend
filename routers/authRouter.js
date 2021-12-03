const router = require('express').Router()
const {
  register,
  login,
  logout,
  generateAccessToken,
} = require('../controllers/authController')

// REGISTER
router.post('/register', register)

// LOGIN
router.post('/login', login)

// LOGOUT
router.post('/logout', logout)

// GENERATE ACCESS TOKEN
router.post('/refresh_token', generateAccessToken)

module.exports = router
