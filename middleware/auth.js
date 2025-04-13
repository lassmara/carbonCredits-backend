const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token; // ✅ Now reading from cookie

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains user ID and role
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
