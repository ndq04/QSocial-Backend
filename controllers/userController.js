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
      const {firstname, lastname, livein, from, job} = req.body
      if (!firstname) {
        return res.status(400).json({message: 'Firstname is requires'})
      }
      if (!lastname) {
        return res.status(400).json({message: 'Lastname is requires'})
      }

      await User.findOneAndUpdate(
        {_id: req.user._id},
        {firstname, lastname, livein, from, job}
      )

      res.status(200).json({message: 'Cập nhật thông tin thành công'})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  },

  updateUserAvatar: async (req, res) => {
    try {
      await User.findOneAndUpdate({_id: req.user._id}, req.body)

      res.status(200).json({message: 'Cập nhật ảnh đại diện thành công'})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  },
}

module.exports = userController
