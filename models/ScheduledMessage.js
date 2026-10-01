const mongoose = require('mongoose');

const ScheduledMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScheduledMessage', ScheduledMessageSchema);