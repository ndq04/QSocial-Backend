const router = require('express').Router()
const auth = require('../middlewares/auth')
const {
  searchUser,
  getUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/userController')

//SEARCH USERS
router.get('/search', auth, searchUser)

//GET A USER
router.get('/user/:id', auth, getUser)

// UPDATE A USER PROFILE
router.patch('/userprofile', auth, updateUserProfile)

// UPDATE A USER AVATAR
router.patch('/useravatar', auth, updateUserAvatar)

module.exports = router
