const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  lastActivityAt: { type: Date, required: true },
  absoluteExpiresAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});

module.exports = mongoose.model('AuthSession', schema);
