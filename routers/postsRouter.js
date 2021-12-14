const router = require('express').Router()
const {
  createPost,
  getPost,
  updatePost,
  likePost,
  unlikePost,
  getUserPosts,
  savePost,
  unsavePost,
  getSavedPost,
  getSinglePost,
} = require('../controllers/postController')
const auth = require('../middlewares/auth')

router.post('/posts', auth, createPost)
router.get('/posts', auth, getPost)
router.patch('/post/:id', auth, updatePost)
router.get('/post/:id/userpost', auth, getUserPosts)

router.patch('/post/:id/like', auth, likePost)
router.patch('/post/:id/unlike', auth, unlikePost)
router.get('/post/:id/singlepost', auth, getSinglePost)
router.patch('/save/:id', auth, savePost)
router.patch('/unsave/:id', auth, unsavePost)
router.get('/savedposts', auth, getSavedPost)

module.exports = router
