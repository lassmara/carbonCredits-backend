const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employerName: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['car', 'bus', 'bike'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', requestSchema);
