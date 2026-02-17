// src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'HistoPath Tracker API is running!' });
});

// Routes (will add later)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/specimens', require('./routes/specimens'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});