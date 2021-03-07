const path = require('path');
const express = require('express');

require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
