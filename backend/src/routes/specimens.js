// src/routes/specimens.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// @route   GET /api/specimens
router.get('/', async (req, res) => {
  try {
    const specimens = await pool.query(
      'SELECT * FROM specimens ORDER BY created_at DESC'
    );
    res.json({ success: true, specimens: specimens.rows });
  } catch (error) {
    console.error('Get specimens error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
