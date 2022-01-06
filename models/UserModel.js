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
    gender: {
      type: String,
      default: 'male',
    },
    from: {
      type: String,
      default: '',
    },
    livein: {
      type: String,
      default: '',
    },
    job: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/doltvro6d/image/upload/v1640764224/qsocial/Screenshot_2021-12-29_144949_vidtnq.png',
    },
    coverimage: {
      type: String,
      default: 'https://i.imgur.com/Uk3dtJn.png',
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
    saved: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {timestamps: true}
)

module.exports = mongoose.model('user', UserSchema)
