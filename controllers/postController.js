const Post = require('../models/PostModel')
const User = require('../models/UserModel')
const Comment = require('../models/CommentModel')

const postController = {
  createPost: async (req, res) => {
    try {
      const {content} = req.body
      if (!content) {
        return res.status(400).json({
          message: 'Thiếu nội dung bài viết',
        })
      }
      const newPost = new Post({
        content,
        user: req.user._id,
      })
      await newPost.save()
      res.status(200).json({
        message: 'Đăng bài viết thành công',
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
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
        message: 'Thành công',
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
  savePost: async (req, res) => {
    try {
      const user = await User.find({_id: req.user._id, saved: req.params.id})
      if (user.length > 0) {
        return res.status(400).json({
          message: 'Bạn đã lưu bài viết này rồi',
        })
      }
      await User.findOneAndUpdate(
        {_id: req.user._id},
        {
          $push: {saved: req.params.id},
        },
        {new: true}
      )
      res.status(200).json({message: 'Lưu bài viết thành công'})
    } catch (error) {
      res.status(404).json({
        message: 'Bài viết không tồn tại',
      })
    }
  },
  unsavePost: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        {_id: req.user._id},
        {
          $pull: {saved: req.params.id},
        },
        {new: true}
      )
      res.status(200).json({message: 'Bỏ lưu bài viết thành công'})
    } catch (error) {
      res.status(404).json({
        message: 'Bài viết không tồn tại',
      })
    }
  },
  getSavedPost: async (req, res) => {
    try {
      const savedPost = await Post.find({
        _id: {$in: req.user.saved},
      })
        .sort('-createdAt')
        .populate(
          'user likes',
          'username avatar firstname lastname livein followings friends'
        )
      res.status(200).json({savedPost})
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
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
      res.status(200).json({
        message: 'Thành công',
        result: posts.length,
        posts,
      })
    } catch (error) {
      res.status(404).json({
        message: 'Người dùng không tồn tại',
      })
    }
  },
  getSinglePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
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

      res.status(200).json({
        message: 'Thành công',
        post,
      })
    } catch (error) {
      return res.status(404).json({
        message: 'Không tìm thấy bài viết',
      })
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await Post.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      })
      await Comment.deleteMany({_id: {$in: post.comments}})
      res.status(200).json({
        message: 'Xóa bài viết thành công',
        removedPost: {
          ...post,
          user: req.user,
        },
      })
    } catch (error) {
      res.status(404).json({
        message: 'Không tìm thấy bài viết',
      })
    }
  },
}

module.exports = postController
