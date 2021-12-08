const User = require('../models/UserModel')

const userController = {
  searchUser: async (req, res) => {
    try {
      const users = await User.find({
        username: {$regex: req.query.username},
      }).select('firstname lastname username avatar')

      res.status(200).json({users})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findOne({_id: req.params.id}).select('-password')
      if (!user) {
        return res.status(400).json({message: 'No user exists'})
      }
      res.status(200).json({user})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  },

  updateUserProfile: async (req, res) => {
    try {
      const {firstname, lastname, livein, from, job, password} = req.body
      const user = await User.findById(req.body.userId)
      if (user) {
        user.firstname = firstname || user.firstname
        user.lastname = lastname || user.lastname
        user.livein = livein || user.livein
        user.from = from || user.from
        user.job = job || user.job

        if (req.body.password) {
          try {
            req.body.password = await argon2.hash(req.body.password)
            user.password = req.body.password
          } catch {
            res.status(500).json({
              success: false,
              message: 'Internal server error !',
              error: err.message,
            })
          }
        }
      }

      const updateUser = await user.save()

      res
        .status(200)
        .json({message: 'Cập nhật thông tin thành công', updateUser})
    } catch (error) {
      return res.status(404).json({message: 'Người dùng không tồn tại'})
    }
  },

  updateUserAvatar: async (req, res) => {
    try {
      const user = await User.findById(req.body.userId)
      if (user) {
        user.avatar = req.body.avatar || user.avatar
      }
      const updateUser = await user.save()

      res
        .status(200)
        .json({message: 'Cập nhật ảnh đại diện thành công', updateUser})
    } catch (error) {
      return res.status(404).json({message: 'Người dùng không tồn tại'})
    }
  },

  updateUserCoverimage: async (req, res) => {
    try {
      const user = await User.findById(req.body.userId)
      if (user) {
        user.coverimage = req.body.coverimage || user.coverimage
      }
      const updateUser = await user.save()

      res.status(200).json({message: 'Cập nhật ảnh bìa thành công', updateUser})
    } catch (error) {
      return res.status(404).json({message: 'Người dùng không tồn tại'})
    }
  },

  friend: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        {_id: req.params.id},
        {
          $push: {friends: req.body._id},
        },
        {new: true}
      )
      await User.findOneAndUpdate(
        {_id: req.body._id},
        {
          $push: {followings: req.params.id},
        },
        {new: true}
      )
      res.status(200).json({message: 'Theo dõi thành công'})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  },

  unfriend: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        {_id: req.params.id},
        {
          $pull: {friends: req.body._id},
        },
        {new: true}
      )
      await User.findOneAndUpdate(
        {_id: req.body._id},
        {
          $pull: {followings: req.params.id},
        },
        {new: true}
      )
      res.status(200).json({message: 'Bỏ theo dõi thành công'})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  },
}

module.exports = userController
