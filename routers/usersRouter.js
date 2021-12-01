const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const User = require('../models/UserModel')

// UPDATE USER
router.patch('/:id', async (req, res) => {
  const {password} = req.body
  const {id} = req.params

  try {
    if (password) {
      try {
        req.body.password = await argon2.hash(password)
      } catch {
        res.status(500).json({
          success: false,
          message: 'Internal server error !',
          error: err.message,
        })
      }
    }
    const user = await User.findById(id)
    Object.assign(user, req.body)
    user.save()
    res.status(200).json({
      success: true,
      message: 'Account has been updated !',
      userUpdate: user,
    })
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'User is not found !',
    })
  }
})

// DELETE USER
router.delete('/:id', async (req, res) => {
  const {id} = req.params

  try {
    const user = await User.findById(id)
    await user.remove()
    res.status(200).json({
      success: true,
      message: 'Account has been deleted !',
    })
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'User is not found !',
    })
  }
})

// GET A USER
// lh:5000/api/users?userId=12345
// lh:5000/api/users?username=Quang
router.get('/', async (req, res) => {
  const userId = req.query.userId
  const username = req.query.username
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({username})
    const {password, updatedAt, ...other} = user._doc
    res.status(200).json({
      success: true,
      message: 'Successful !',
      user: other,
    })
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'User is not found !',
    })
  }
})

// FOLLOW A USER
router.put('/:id/follow', async (req, res) => {
  const {userId} = req.body
  const {id} = req.params
  if (userId !== id) {
    try {
      const user = await User.findById(id)
      const currentUser = await User.findById(userId)

      if (!user.followers.includes(userId)) {
        await user.updateOne({$push: {followers: userId}})
        await currentUser.updateOne({
          $push: {followings: id},
        })
        res.status(200).json({
          success: true,
          message: 'User has been followed !',
        })
      } else {
        res.status(403).json({
          success: false,
          message: 'You already follow this user !',
        })
      }
    } catch (err) {
      res.status(404).json({
        success: false,
        message: 'User is not found !',
      })
    }
  } else {
    res.status(403).json({
      success: false,
      message: 'You can not follow yourself !',
    })
  }
})

// UNFOLLOW A USER
router.put('/:id/unfollow', async (req, res) => {
  const {userId} = req.body
  const {id} = req.params
  if (userId !== id) {
    try {
      const user = await User.findById(id)
      const currentUser = await User.findById(userId)
      if (user.followers.includes(userId)) {
        await user.updateOne({$pull: {followers: userId}})
        await currentUser.updateOne({
          $pull: {followings: id},
        })
        res.status(200).json({
          success: true,
          message: 'User has been unfollowed !',
        })
      } else {
        res.status(403).json({
          success: false,
          message: 'You are not following this user !',
        })
      }
    } catch (err) {
      res.status(404).json({
        success: false,
        message: 'User is not found !',
      })
    }
  } else {
    res.status(403).json({
      success: false,
      message: 'You can not unfollow yourself !',
    })
  }
})

module.exports = router
