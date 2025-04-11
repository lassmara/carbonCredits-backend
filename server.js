const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

require('./config/passport'); // Load passport config

const authRoutes = require('./routes/auth');
const pointRoutes = require('./routes/points');

const app = express();

// Middleware
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // ✅ Allow session cookies
}));

app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/points', pointRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
});
