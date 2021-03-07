const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/userModel');

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
