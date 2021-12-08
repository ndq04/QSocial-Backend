const Post = require('../models/PostModel')

const postController = {
  createPost: async (req, res) => {
    try {
      const {content, images, user} = req.body
      const newPost = new Post({
        content,
        images,
        user,
      })
      await newPost.save()
      res.status(200).json({
        message: 'Đăng bài viết thành công !',
        newPost,
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  },
  getPost: async (req, res) => {
    try {
      console.log(req.user)
      const posts = await Post.find({
        user: [...req.user.followings, req.user._id],
      })
      if (!posts) {
        return res.status(404).json({
          message: 'No post found',
        })
      }
      res.status(200).json({
        message: 'success',
        result: posts.length,
        posts,
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  },
}

module.exports = postController
