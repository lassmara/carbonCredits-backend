// routes/trips.js
const express = require('express');
const router = express.Router();
const Trip = require('./Trip');
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Employee submits a trip
router.post('/', auth, role('employee'), async (req, res) => {
  const { startLocation, endLocation, mode, distance, points } = req.body;

  const trip = new Trip({
    employeeId: req.user.id,
    startLocation,
    endLocation,
    mode,
    distance,
    points
  });

  await trip.save();
  res.status(201).json({ message: 'Trip logged successfully' });
});

// Employee's trip history
router.get('/employee', auth, role('employee'), async (req, res) => {
  const trips = await Trip.find({ employeeId: req.user.id });
  res.json(trips);
});

// Employer views employee trips
router.get('/employer', auth, role('employer'), async (req, res) => {
  const employer = await User.findById(req.user.id);
  const trips = await Trip.find({ employerName: employer.employerName });
  res.json(trips);
});

module.exports = router;
