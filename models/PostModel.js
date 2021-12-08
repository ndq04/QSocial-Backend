const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema(
  {
    content: {
      type: String,
    },
    images: {
      type: Array,
      default: [],
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
    ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'comment',
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
  },
  {timestamps: true}
)

module.exports = mongoose.model('post', PostSchema)
