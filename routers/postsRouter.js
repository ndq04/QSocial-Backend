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

// DELETE A POST
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      await post.deleteOne()
      res.status(200).json({
        success: true,
        message: 'The post has been deleted !',
      })
    } else {
      return res.status(403).json({
        success: false,
        message: 'User is not found !',
      })
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'The post is not found !',
    })
  }
})

// LIKE/UNLIKE A POST
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {likes: req.body.userId},
      })
      res.status(200).json({
        success: true,
        message: 'The post has been liked !',
      })
    } else {
      await post.updateOne({
        $pull: {likes: req.body.userId},
      })
      res.status(200).json({
        success: true,
        message: 'The post has been unliked !',
      })
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error !',
      error: err.message,
    })
  }
})

// GET A POST
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.status(200).json({
      success: true,
      message: 'Successful !',
      post,
    })
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'The post is not found !',
    })
  }
})

// GET TIMELINE POSTS
router.get('/timeline/:userId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId)
    const userPosts = await Post.find({
      userId: currentUser._id,
    })
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({userId: friendId})
      })
    )
    res.status(200).json(userPosts.concat(...friendPosts))
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error !',
      error: err.message,
    })
  }
})

// GET USER'S ALL POSTS
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    })
    const posts = await Post.find({userId: user._id})
    res.status(200).json({
      success: true,
      message: 'Successful !',
      posts,
    })
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'User is not found !',
    })
  }
})

module.exports = router
