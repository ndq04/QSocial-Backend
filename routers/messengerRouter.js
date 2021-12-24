const router = require('express').Router()
const {
  createMessage,
  getConversations,
  getMessages,
} = require('../controllers/messengerController')
const auth = require('../middlewares/auth')

router.post('/message', auth, createMessage)
router.get('/conversations', auth, getConversations)
router.get('/message/:id', auth, getMessages)

module.exports = router
