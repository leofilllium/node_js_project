const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  topic: String,
  imageUrl: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String
});

module.exports = mongoose.model('Post', postSchema);
