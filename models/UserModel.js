const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      trim: true,
      require: true,
      maxlength: 10,
    },
    lastname: {
      type: String,
      trim: true,
      require: true,
      maxlength: 10,
    },
    username: {
      type: String,
      trim: true,
      require: true,
      unique: true,
      maxlength: 15,
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
    coverimage: {
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
