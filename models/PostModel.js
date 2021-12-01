const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    image: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  {timestamps: true}
)

module.exports = mongoose.model('posts', PostSchema)
