const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));
router.get('/me', (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not logged in' });
    res.json(req.user);
  });
  
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      // Send user info as a redirect
      res.redirect(`http://localhost:3000/dashboard?email=${req.user.email}&role=${req.user.role}`);
    }
  );
  

module.exports = router;
