const mongoose = require('mongoose');

let PostModel = {};

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

PostModel = mongoose.model('Post', PostSchema);
module.exports = PostModel;
