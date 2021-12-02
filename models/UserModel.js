const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      require: true,
      unique: true,
      maxlength: 15,
    },
    fullname: {
      type: String,
      trim: true,
      require: true,
      maxlength: 25,
    },
    email: {
      type: String,
      trime: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: 'male',
    },
    phone: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    story: {
      type: String,
      defalut: '',
      maxlength: 200,
    },
    friends: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
    ],
    followings: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {timestamps: true}
)

module.exports = mongoose.model('user', UserSchema)
