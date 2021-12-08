const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({}, {timestamps: true})

module.exports = mongoose.model('comment', CommentSchema)
