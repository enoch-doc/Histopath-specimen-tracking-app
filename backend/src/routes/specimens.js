// src/routes/specimens.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');

// @route   GET /api/specimens
// @desc    Get all specimens
router.get('/', auth, async (req, res) => {
  try {
    const specimens = await pool.query(
      `SELECT s.*, 
        u.full_name as registered_by_name
       FROM specimens s
       LEFT JOIN users u ON s.registered_by = u.id
       ORDER BY s.created_at DESC`
    );
    res.json({ success: true, specimens: specimens.rows });
  } catch (error) {
    console.error('Get specimens error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/specimens/:id
// @desc    Get single specimen with timeline
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const specimenQuery = await pool.query(
      `SELECT s.*, u.full_name as registered_by_name
       FROM specimens s
       LEFT JOIN users u ON s.registered_by = u.id
       WHERE s.id = $1`,
      [id]
    );

    if (specimenQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Specimen not found' });
    }

    const specimen = specimenQuery.rows[0];

    const historyQuery = await pool.query(
      `SELECT sh.*, u.full_name as performed_by_name
       FROM stage_history sh
       LEFT JOIN users u ON sh.performed_by = u.id
       WHERE sh.specimen_id = $1
       ORDER BY sh.timestamp ASC`,
      [id]
    );

    const photosQuery = await pool.query(
      `SELECT p.*, u.full_name as uploaded_by_name
       FROM photos p
       LEFT JOIN users u ON p.uploaded_by = u.id
       WHERE p.specimen_id = $1
       ORDER BY p.uploaded_at ASC`,
      [id]
    );

    res.json({
      success: true,
      specimen,
      timeline: historyQuery.rows,
      photos: photosQuery.rows,
    });

  } catch (error) {
    console.error('Get specimen error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/specimens
// @desc    Register new specimen
router.post('/', auth, async (req, res) => {
  try {
    const {
      patientName,
      patientId,
      age,
      sex,
      specimenType,
      clinicalNotes,
      referringDoctor,
      priority,
    } = req.body;

    // Generate accession number
    const year = new Date().getFullYear().toString().slice(-2);
    const randomNum = Math.floor(Math.random() * 100000);
    const accessionNumber = `S${year}-${String(randomNum).padStart(5, '0')}`;

    // Insert specimen
    const newSpecimen = await pool.query(
      `INSERT INTO specimens 
        (accession_number, patient_name, patient_id, age, sex, specimen_type, 
         clinical_notes, referring_doctor, priority, current_stage, registered_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        accessionNumber,
        patientName,
        patientId,
        age || null,
        sex || null,
        specimenType,
        clinicalNotes || null,
        referringDoctor || null,
        priority.toLowerCase(),
        'reception',
        req.user.id,
      ]
    );

    const specimen = newSpecimen.rows[0];

    // Add initial stage history
    await pool.query(
      `INSERT INTO stage_history (specimen_id, stage, notes, performed_by)
       VALUES ($1, $2, $3, $4)`,
      [specimen.id, 'reception', 'Specimen registered and received', req.user.id]
    );

    res.status(201).json({
      success: true,
      specimen,
      accessionNumber,
    });

  } catch (error) {
    console.error('Register specimen error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/specimens/:id/stage
// @desc    Update specimen stage
router.put('/:id/stage', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { newStage, notes } = req.body;
    const userRole = req.user.role;

    // Role-based stage permissions
    const stagePermissions = {
      reception: ['receptionist', 'admin'],
      grossing: ['lab_technician', 'lab_scientist', 'admin'],
      processing: ['lab_technician', 'lab_scientist', 'admin'],
      embedding: ['lab_technician', 'lab_scientist', 'admin'],
      sectioning: ['lab_technician', 'lab_scientist', 'admin'],
      staining: ['lab_technician', 'lab_scientist', 'admin'],
      slide_labeling: ['lab_technician', 'lab_scientist', 'admin'],
      slide_dispatch: ['lab_technician', 'lab_scientist', 'secretary', 'admin'],
      reporting: ['pathologist', 'admin'],
      verification: ['secretary', 'pathologist', 'admin'],
      report_dispatch: ['secretary', 'receptionist', 'admin'],
    };

    // Check if user has permission for this stage
    const allowedRoles = stagePermissions[newStage] || [];
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Access Denied: Only ${allowedRoles.join(', ')} can perform ${newStage} stage.`,
        requiredRoles: allowedRoles,
        yourRole: userRole
      });
    }

    // Update specimen current stage
    await pool.query(
      `UPDATE specimens SET current_stage = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [newStage, id]
    );

    // Add to stage history
    await pool.query(
      `INSERT INTO stage_history (specimen_id, stage, notes, performed_by)
       VALUES ($1, $2, $3, $4)`,
      [id, newStage, notes || null, req.user.id]
    );

    res.json({ success: true, message: 'Stage updated successfully' });

  } catch (error) {
    console.error('Update stage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
  
// @route   GET /api/specimens/search/:query
// @desc    Search specimens
router.get('/search/:query', auth, async (req, res) => {
  try {
    const { query } = req.params;

    const specimens = await pool.query(
      `SELECT * FROM specimens 
       WHERE accession_number ILIKE $1 
       OR patient_name ILIKE $1 
       OR patient_id ILIKE $1
       ORDER BY created_at DESC`,
      [`%${query}%`]
    );

    res.json({ success: true, specimens: specimens.rows });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;