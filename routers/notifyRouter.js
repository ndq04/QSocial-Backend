const router = require('express').Router()
const {createNotify} = require('../controllers/notifyController')
const auth = require('../middlewares/auth')

router.post('/notify', auth, createNotify)

module.exports = router
