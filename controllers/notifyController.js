const Notifies = require('../models/NotifyModel')

const NotifyController = {
  createNotify: async (req, res) => {
    try {
      const {id, recipients, url, content, image, text, isRead} = req.body
      const notify = await new Notifies({
        id,
        recipients,
        url,
        content,
        image,
        text,
        isRead,
        user: req.user,
      })
      notify.save()
      res.status(200).json({notify})
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
}

module.exports = NotifyController
