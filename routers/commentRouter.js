const router = require('express').Router()
const {
  createComment,
  updateComment,
  likeComment,
  unlikeComment,
} = require('../controllers/commentController')
const auth = require('../middlewares/auth')

router.post('/comment', auth, createComment)
router.patch('/comment/:id', auth, updateComment)

router.patch('/comment/:id/like', auth, likeComment)
router.patch('/comment/:id/unlike', auth, unlikeComment)

module.exports = router
