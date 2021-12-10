const Comment = require('../models/CommentModel')
const Post = require('../models/PostModel')

const commentController = {
  createComment: async (req, res) => {
    const {content, postId, tag, reply} = req.body
    const newComment = await new Comment({
      user: req.user._id,
      content,
      tag,
      reply,
    })
    const post = await Post.findOneAndUpdate(
      {_id: postId},
      {
        $push: {comments: newComment._id},
      }
    )
    await newComment.save()
    res.status(200).json({newComment})
    try {
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },
  updateComment: async (req, res) => {
    const {content} = req.body

    await Comment.findOneAndUpdate(
      {_id: req.params.id, user: req.user._id},
      {content}
    )
    res.status(200).json({message: 'Success'})
    try {
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },
}

module.exports = commentController
