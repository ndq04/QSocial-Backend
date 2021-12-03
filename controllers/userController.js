const User = require('../models/UserModel')

const userController = {
  searchUser: async (req, res) => {
    try {
      const users = await User.find({username: {$regex: req.query.username}})
        .limit(10)
        .select('firstname lastname username avatar')

      res.status(200).json({users})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.find({username: {_id: req.params.id}})
        .limit(10)
        .select('-password')
      if (user) {
        return res.status(400).json({message: 'No user exists'})
      }
      res.status(200).json({user})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  },
}

module.exports = userController
