const User = require('../models/UserModel')

const userController = {
  searchUser: async (req, res) => {
    try {
      const users = await User.find({username: {$regex: req.query.username}})
        .limit(10)
        .select('fullname username avatar')

      res.status(200).json({users})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  },
}

module.exports = userController
