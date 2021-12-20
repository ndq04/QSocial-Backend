const Comment = require('../models/CommentModel')
const Post = require('../models/PostModel')

const commentController = {
  createComment: async (req, res) => {
    const {content, postId, tag, reply, postUserId, user} = req.body
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({
        message: 'Không tìm thấy bài viết',
      })
    }
    const newComment = await new Comment({
      content,
      tag,
      reply,
      postId,
      postUserId,
      user: req.user,
    })
    try {
      await Post.findOneAndUpdate(
        {_id: postId},
        {
          $push: {comments: newComment._id},
        }
      )
      await newComment.save()
      res.status(200).json({newComment})
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
  updateComment: async (req, res) => {
    try {
      const {content} = req.body
      const newComment = await Comment.findOneAndUpdate(
        {_id: req.params.id, user: req.user._id},
        {content}
      )
      res
        .status(200)
        .json({message: 'Cập nhật bình luận thành công', newComment})
    } catch (error) {
      res.status(404).json({
        message: 'Bình luận không tồn tại',
      })
    }
  },
  likeComment: async (req, res) => {
    try {
      const comment = await Comment.find({
        _id: req.params.id,
        likes: req.user._id,
      })
      if (comment.length > 0) {
        return res.status(400).json({
          message: 'Bạn đã thích bình luận này rồi',
        })
      } else {
        await Comment.findOneAndUpdate(
          {_id: req.params.id},
          {
            $push: {likes: req.user._id},
          },
          {new: true}
        )
        res.status(200).json({message: 'Đã thích bình luận'})
      }
    } catch (error) {
      res.status(404).json({
        message: 'Bình luận không tồn tại',
      })
    }
  },
  unlikeComment: async (req, res) => {
    try {
      await Comment.findOneAndUpdate(
        {_id: req.params.id},
        {
          $pull: {likes: req.user._id},
        },
        {new: true}
      )
      res.status(200).json({message: 'Bỏ thích bình luận'})
    } catch (error) {
      res.status(404).json({
        message: 'Bình luận không tồn tại',
      })
    }
  },
  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findOneAndDelete({
        _id: req.params.id,
        $or: [{postUserId: req.user._id}, {user: req.user._id}],
      })
      if (!comment) {
        return res.status(404).json({message: 'Bình luận không tồn tại'})
      }
      await Post.findOneAndUpdate(
        {_id: comment.postId},
        {
          $pull: {comments: req.params.id},
        }
      )
      res.status(200).json({
        message: 'Xóa bình luận thành công',
      })
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
}

module.exports = commentController
