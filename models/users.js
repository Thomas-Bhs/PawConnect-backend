const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  token: String,
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['civil', 'agent'], required: true },
  establishmentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'establishments' },
});

const User = mongoose.model('users', userSchema);
module.exports = User;
