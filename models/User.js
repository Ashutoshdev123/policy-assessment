const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  dob: { type: Date },
  address: { type: String },
  phoneNumber: { type: String },
  state: { type: String },
  zipCode: { type: String },
  email: { type: String, required: true },
  gender: { type: String },
  userType: { type: String }
});

module.exports = mongoose.model('User', UserSchema);