const express = require('express');
const router = express.Router();

const { postBfhl } = require('../controllers/bfhlController');

// POST /api/bfhl
router.post('/', postBfhl);

module.exports = router;
