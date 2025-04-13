const mongoose = require('mongoose');

const EmployerSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Employer', EmployerSchema);
