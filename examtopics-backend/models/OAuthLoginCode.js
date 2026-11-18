const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  challenge: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});

module.exports = mongoose.model('OAuthLoginCode', schema);
