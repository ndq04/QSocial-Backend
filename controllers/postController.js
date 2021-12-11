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
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
  getPost: async (req, res) => {
    try {
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
          message: 'Không tìm thấy bài viết',
        })
      }
      res.status(200).json({
        message: 'success',
        result: posts.length,
        posts,
      })
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
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
      res.status(404).json({
        message: 'Bài viết không tồn tại',
      })
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Post.find({_id: req.params.id, likes: req.user._id})
      if (post.length > 0) {
        return res.status(400).json({
          message: 'Bạn đã thích bài viết này rồi',
        })
      }
      await Post.findOneAndUpdate(
        {_id: req.params.id},
        {
          $push: {likes: req.user._id},
        },
        {new: true}
      )
      res.status(200).json({message: 'Đã thích bài viết'})
    } catch (error) {
      res.status(404).json({
        message: 'Bài viết không tồn tại',
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
      res.status(200).json({message: 'Đã bỏ thích bài viết'})
    } catch (error) {
      res.status(404).json({
        message: 'Bài viết không tồn tại',
      })
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const posts = await Post.find({
        user: req.params.id,
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
          message: 'Không tìm thấy bài viết',
        })
      }
      res.status(200).json({
        message: 'success',
        result: posts.length,
        posts,
      })
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
}

module.exports = postController
