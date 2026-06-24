const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');

// Health check / welcome route
router.get('/', indexController.getWelcome);

module.exports = router;
