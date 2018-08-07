const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  body: { type: String },
  link: { type: String },
  picUrl: { type: String },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
