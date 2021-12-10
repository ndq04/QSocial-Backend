const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
  },
  {timestamps: true}
)

module.exports = mongoose.model('comment', CommentSchema)
