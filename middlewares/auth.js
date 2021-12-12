const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
    if (!token) {
      return res.status(500).json({message: 'Không hợp lệ'})
    }

    const decoded = jwt.verify(token, process.env.ACCESSTOKENSECRET)
    if (!decoded) {
      return res.status(500).json({message: 'Không hợp lệ'})
    }

    const user = await User.findOne({_id: decoded.id})
    req.user = user
    next()
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = auth
