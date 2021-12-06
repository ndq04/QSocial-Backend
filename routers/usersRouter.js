const router = require('express').Router()
const auth = require('../middlewares/auth')
const {
  searchUser,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  updateUserCoverimage,
  follow,
  unfollow,
} = require('../controllers/userController')

//SEARCH USERS
router.get('/search', auth, searchUser)

//GET A USER
router.get('/user/:id', auth, getUser)

// UPDATE PROFILE
router.patch('/userprofile', auth, updateUserProfile)

// UPDATE AVATAR
router.patch('/useravatar', auth, updateUserAvatar)

// UPDATE COVERIMAGE
router.patch('/usercoverimage', auth, updateUserCoverimage)

// FOLLOW
router.patch('/user/:id/follow', auth, follow)

// UN FOLLOW
router.patch('/user/:id/unfollow', auth, unfollow)

module.exports = router
