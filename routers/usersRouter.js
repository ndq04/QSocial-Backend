const router = require('express').Router()
const auth = require('../middlewares/auth')
const {
  searchUser,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  updateUserCoverimage,
  friend,
  unfriend,
} = require('../controllers/userController')

router.get('/search', auth, searchUser)
router.get('/user/:id', auth, getUser)
router.patch('/userprofile', auth, updateUserProfile)
router.patch('/useravatar', auth, updateUserAvatar)
router.patch('/usercoverimage', auth, updateUserCoverimage)
router.patch('/user/:id/friend', auth, friend)
router.patch('/user/:id/unfriend', auth, unfriend)

module.exports = router
