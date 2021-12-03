const router = require('express').Router()
const auth = require('../middlewares/auth')
const {searchUser} = require('../controllers/userController')

router.get('/search', auth, searchUser)

module.exports = router
