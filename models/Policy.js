const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  policyNumber: { type: String, required: true },
  policyStartDate: { type: Date },
  policyEndDate: { type: Date },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Policy', PolicySchema);