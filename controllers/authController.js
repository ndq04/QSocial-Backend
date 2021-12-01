const User = require('../models/UserModel')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const authController = {
  register: async (req, res) => {
    try {
      const {fullname, username, email, password, gender} = req.body
      const newUsername = username.toLowerCase().replace(/ /g, '')

      // Check exists username
      const checkExistsUsername = await User.findOne({username: newUsername})
      if (checkExistsUsername) {
        return res.status(400).json({
          message: 'This username already exist !',
        })
      }

      // Check exists email
      const checkExistsEmail = await User.findOne({email})
      if (checkExistsEmail) {
        return res.status(400).json({
          message: 'This email already exist !',
        })
      }

      // Check password length
      if (password.length < 6) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters long !',
        })
      }

      // Hash password
      const hashedPassword = await argon2.hash(password)

      const newUser = await new User({
        fullname,
        username: newUsername,
        email,
        password: hashedPassword,
      })

      const access_token = createAccessToken({id: newUser._id})
      const refresh_token = createRefreshToken({id: newUser._id})

      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: 'api/refresh_token',
        maxAge: 24 * 30 * 60 * 60 * 1000, //30 days
      })

      await newUser.save()

      res.status(200).json({
        message: 'Registed succes !',
        access_token,
        user: newUser,
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  },

  login: async (req, res) => {
    try {
      const {email, password} = req.body
      const user = await User.findOne({email}).populate(
        'friends followings',
        '-password'
      )
      if (!user) {
        return res.status(400).json({
          message: 'User does not exist !',
        })
      }

      const validPassword = await argon2.verify(user.password, password)
      if (!validPassword) {
        return res.status(400).json({
          success: false,
          message: 'Password is incorrect !',
        })
      }

      const access_token = createAccessToken({id: user._id})
      const refresh_token = createRefreshToken({id: user._id})

      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: 'api/refresh_token',
        maxAge: 24 * 30 * 60 * 60 * 1000, //30 days
      })

      res.status(200).json({
        message: 'Logged in succes !',
        access_token,
        user,
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', {path: 'api/refresh_token'})
      res.status(200).json({message: 'Logged out !'})
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  },

  generateAccessToken: async (req, res) => {
    try {
      const ref_token = req.cookies.refreshtoken
      if (!ref_token) {
        return res.status(400).json({
          message: 'You are not logged in !',
        })
      }
      jwt.verify(
        ref_token,
        process.env.REFRESHTOKENSECRET,
        async (err, result) => {
          if (err) {
            return res.status(400).json({message: 'You are not logged in !'})
          }

          const user = await User.findById(result.id)
            .select('-password')
            .populate('friends followings')

          if (!user) {
            return res.status(400).json({message: 'User does not exist'})
          }

          const access_token = createAccessToken({id: result._id})

          res.status(200).json({
            access_token,
            user,
          })
        }
      )
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  },
}

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESSTOKENSECRET, {expiresIn: '1d'})
}
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESHTOKENSECRET, {expiresIn: '30d'})
}
module.exports = authController
