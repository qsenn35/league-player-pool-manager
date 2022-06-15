const mongoose = require('mongoose');

exports.User = mongoose.model('User', {
  id: { type: String, required: true },
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now() },
  accessToken: { type: String },
});