const express = require('express');
const path = require('path');
const fs = require('fs'); // Add file system module to check if file exists
const logger = require('../config/logger'); // Import logger
const router = express.Router();

// Resolve the path to questions.json dynamically
const QUESTIONS_FILE = path.join(__dirname, '../../data/questions.json'); 
console.log('Questions file path:', QUESTIONS_FILE);

// Add a check to ensure the file exists
if (!fs.existsSync(QUESTIONS_FILE)) {
  logger.error(`Questions file not found at path: ${QUESTIONS_FILE}`);
} else {
  logger.info(`Questions file located at: ${QUESTIONS_FILE}`);
}

// Endpoint to serve questions.json file statically
router.get('/', (req, res) => {
  logger.info('Serving questions data to client');

  // Use fs to send the file, and add error handling
  res.sendFile(QUESTIONS_FILE, (err) => {
    if (err) {
      logger.error(`Error sending questions file: ${err.message}`);
      res.status(500).send('Error retrieving questions data');
    }
  });
});

module.exports = router;
