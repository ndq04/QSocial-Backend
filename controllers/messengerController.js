const Conversation = require('../models/ConversationModel')
const Messenger = require('../models/MessengerModel')

const messengerController = {
  createMessage: async (req, res) => {
    try {
      const {recipient, text, media} = req.body
      if (!recipient || (!text.trim() && media.length === 0)) return
      const newConversation = await Conversation.findOneAndUpdate(
        {
          $or: [
            {recipients: [req.user._id, recipient]},
            {recipients: [recipient, req.user._id]},
          ],
        },
        {
          recipients: [req.user._id, recipient],
          text,
          media,
        },
        {
          new: true,
          upsert: true,
        }
      )
      const newMessage = new Messenger({
        conversation: newConversation._id,
        sender: req.user._id,
        recipient,
        text,
        media,
      })
      await newMessage.save()
      res.status(200).json({newConversation})
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
  getConversations: async (req, res) => {
    try {
      const conversation = await Conversation.find({
        recipients: req.user._id,
      })
        .sort('-updateAt')
        .populate('recipients', 'avatar firstname lastname')
      res.status(200).json({
        conversation,
        result: conversation.length,
      })
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
  getMessages: async (req, res) => {
    try {
      const message = await Messenger.find({
        $or: [
          {sender: req.user._id, recipient: req.params.id},
          {sender: req.params.id, recipient: req.user._id},
        ],
      })
        .sort('-createdAt')
        .populate('recipient', 'avatar firstname lastname')

      res.status(200).json({
        message,
        result: message.length,
      })
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi máy chủ nội bộ',
        error: error.massage,
      })
    }
  },
}

module.exports = messengerController
