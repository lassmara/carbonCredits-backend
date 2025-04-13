const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// ✅ Register (Employee or Employer) and Replace if Exists
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, role, employerName } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      fullName,
      email,
      password: hashedPassword,
      role,
      points: 0,
    };

    if (role === 'employee') {
      if (!employerName) {
        return res.status(400).json({ message: 'Employer name is required for employees.' });
      }
      userData.employerName = employerName;
    }

    await User.findOneAndUpdate(
      { email },
      { $set: userData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: 'User registered or updated successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ JWT Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
    });

    res.json({ message: 'Login successful', role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get Authenticated User (for frontend dashboard)
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// ✅ Google OAuth Login
router.get('/google', (req, res, next) => {
  // Save the role from query to session for later use
  req.session.role = req.query.role;
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// ✅ Google OAuth Callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    const { profile, user } = req.user;

    if (!user) {
      // ❌ Email not found, redirect to frontend register page
      return res.redirect(`http://localhost:3000?error=notregistered&email=${profile.emails[0].value}`);
    }

    // ✅ Email found, login the user and set token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
    });

    const redirectUrl = `http://localhost:3000/dashboard/${user.role}`;
    res.redirect(redirectUrl);
  }
);


module.exports = router;
