const router = require('express').Router()
const auth = require('../middlewares/auth')
const {
  searchUser,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  friend,
  unfriend,
} = require('../controllers/userController')

//SEARCH USERS
router.get('/search', auth, searchUser)

//GET A USER
router.get('/user/:id', auth, getUser)

// UPDATE A USER PROFILE
router.patch('/userprofile', auth, updateUserProfile)

// UPDATE A USER AVATAR
router.patch('/useravatar', auth, updateUserAvatar)

// ADD FRIEND
router.patch('/user/:id/friend', auth, friend)

// UN FRIEND
router.patch('/user/:id/unfriend', auth, unfriend)

module.exports = router
