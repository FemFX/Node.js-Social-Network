const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  image_id: { type: Schema.ObjectId },
  email: { type: String },
  name: { type: String },
  gravatar: { type: String },
  comment: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);
