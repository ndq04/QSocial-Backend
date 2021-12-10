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
        .sort('-createdAt')
        .populate(
          'user likes',
          'username avatar firstname lastname livein followings friends'
        )
        .populate({
          path: 'comments',
          populate: {
            path: 'user likes',
            select: '-password',
          },
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
  updatePost: async (req, res) => {
    try {
      const {content, images} = req.body
      const post = await Post.findOneAndUpdate(
        {_id: req.params.id},
        {
          content,
          images,
        }
      ).populate('user likes', 'username avatar firstname lastname')
      res.status(200).json({
        message: 'Cập nhật bài viết thành công !',
        updatePost: {
          ...post._doc,
          content,
          images,
        },
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        {_id: req.params.id},
        {
          $push: {likes: req.user._id},
        },
        {new: true}
      )
      res.status(200).json({message: 'Đã thích bài viết'})
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  },
  unlikePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        {_id: req.params.id},
        {
          $pull: {likes: req.user._id},
        },
        {new: true}
      )
      res.status(200).json({message: 'Bỏ thích bài viết'})
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  },
}

module.exports = postController