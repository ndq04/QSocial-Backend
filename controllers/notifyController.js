const Notify = require('../models/NotifyModel')

const NotifyController = {
  createNotify: async (req, res) => {
    try {
      const {id, recipients, url, content, image, text, isRead} = req.body
      if (recipients.includes(req.user._id.toString())) return
      const notify = await new Notify({
        id,
        recipients,
        url,
        content,
        image,
        text,
        isRead,
        user: req.user,
      })
      await notify.save()
      res.status(200).json({notify})
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
  removeNotify: async (req, res) => {
    try {
      const notify = await Notify.findOneAndDelete({
        id: req.params.id,
        url: req.query.url,
      })
      res.status(200).json({notify})
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
  getNotify: async (req, res) => {
    console.log(req.user.friends)
    try {
      const notifies = await Notify.find({
        recipients: req.user._id,
      })
        .sort('-createdAt')
        .populate('user', 'avatar firstname lastname')
      res.status(200).json({notifies})
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
  isReadNotify: async (req, res) => {
    try {
      const notifies = await Notify.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {isRead: true}
      )

      res.status(200).json({notifies})
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
  deleteAllNotifies: async (req, res) => {
    try {
      const notifies = await Notify.deleteMany({
        recipients: req.user._id,
      })

      res.status(200).json({notifies})
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
}

module.exports = NotifyController
