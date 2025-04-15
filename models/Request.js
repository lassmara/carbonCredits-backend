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
  distance: { // new field for the distance traveled
    type: Number,
    required: true
  },
  location: { // new field for storing employee's starting/ending location
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

requestSchema.index({ location: '2dsphere' }); // For geospatial queries

module.exports = mongoose.model('Request', requestSchema);
