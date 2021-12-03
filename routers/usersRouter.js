const router = require('express').Router()
const auth = require('../middlewares/auth')
const {searchUser, getUser} = require('../controllers/userController')

//SEARCH USERS
router.get('/search', auth, searchUser)

//GET A USER
router.get('/user/:id', auth, getUser)

module.exports = router
