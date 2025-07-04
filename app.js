const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const app = express();

// Passport Config
require('./config/passport')(passport);

// MongoDB Connection
console.log('🔍 Connecting to MongoDB Atlas...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected to Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// EJS
app.set('view engine', 'ejs');

// Body Parser Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method Override
app.use(methodOverride('_method'));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Messages
app.use(flash());

// Global Template Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/categories', require('./routes/categories'));

// Server Startup
const PORT = process.env.PORT || 3000;

const startServer = async (port) => {
  try {
    const server = app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
};

startServer(PORT);
