const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const PostSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: 'user' },
  text: { type: String, required: true },
  name: { type: String },
  avatar: { type: String },
  likes: [
    {
      user: { type: ObjectId, ref: 'user' },
    },
  ],
  comments: [
    {
      user: { type: ObjectId, ref: 'user' },
      text: { type: String, required: true },
      name: { type: String },
      avatar: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  date: { type: Date, default: Date.now },
})

module.exports = Post = mongoose.model('post', PostSchema)
