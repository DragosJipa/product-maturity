// server/routes/questionRoutes.js


const express = require('express');
const path = require('path');
const logger = require('../config/logger'); // Import logger
const router = express.Router();

// Load questions from JSON file
const QUESTIONS_FILE = path.join(__dirname, '../../data/questions.json'); // Adjust path to where the JSON file is located

// Endpoint to serve questions.json file statically
router.get('/', (req, res) => {
  logger.info('Serving questions data to client');
  res.sendFile(QUESTIONS_FILE);
});

module.exports = router;
