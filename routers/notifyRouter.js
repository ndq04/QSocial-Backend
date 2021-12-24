const router = require('express').Router()
const {
  createNotify,
  removeNotify,
  getNotify,
  deleteAllNotifies,
  isReadNotify,
} = require('../controllers/notifyController')
const auth = require('../middlewares/auth')

router.post('/notify', auth, createNotify)
router.delete('/notify/:id', auth, removeNotify)
router.get('/notifies', auth, getNotify)
router.delete('/deleteallnotifies', auth, deleteAllNotifies)
router.patch('/isreadnotify/:id', auth, isReadNotify)

module.exports = router
