const router = require('express').Router()
const {
  createComment,
  updateComment,
} = require('../controllers/commentController')
const auth = require('../middlewares/auth')

router.post('/comment', auth, createComment)
router.patch('/comment/:id', auth, updateComment)

module.exports = router
