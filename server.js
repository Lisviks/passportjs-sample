const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/userModel');

const { protect } = require('./middlewares/auth');

require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

mongoose.connect(
  process.env.MONGO_DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log('MongoDB connected')
);

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ email: username });

        if (!user) {
          return done(null, false);
        }

        const validPassword = await user.matchPassword(password);

        if (validPassword) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.post('/signup', async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });

  if (userExists) {
    res.status(400).json({ msg: 'User already exists' });
  }

  const user = await User.create({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    res
      .status(201)
      .json({ _id: user._id, email: user.email, createdAt: user.createdAt });
  } else {
    res.status(400).json({ msg: 'Invalid user data' });
  }
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/success.html',
    failureRedirect: '/fail.html',
  })
);

app.get('/protected', protect, (req, res) => {
  res.json({ msg: 'protected route' });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.json({ msg: 'logged out' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
