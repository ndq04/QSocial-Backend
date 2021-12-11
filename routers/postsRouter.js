const router = require('express').Router()
const {
  createPost,
  getPost,
  updatePost,
  likePost,
  unlikePost,
} = require('../controllers/postController')
const auth = require('../middlewares/auth')

router.post('/posts', auth, createPost)
router.get('/posts', auth, getPost)
router.patch('/post/:id', auth, updatePost)

router.patch('/post/:id/like', auth, likePost)
router.patch('/post/:id/unlike', auth, unlikePost)

module.exports = router
