const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(
  process.env.MONGO_DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log('MongoDB connected')
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
