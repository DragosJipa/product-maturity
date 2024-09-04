// server/utils/dataHelpers.js

const fs = require('fs');
const logger = require('../config/logger'); // Import logger

const DB_FILE = 'responses.json';

// Helper function to validate form data
const validateFormData = (data) => {
  return typeof data === 'object' && data !== null && Object.keys(data).length > 0;
};

// Updated Helper function to save form data (clears previous records first)
const saveFormData = (formData) => {
  // Overwrite responses.json with only the new submission
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify([formData], null, 2)); // Save only the new formData
    logger.info('Previous data cleared. New form data saved successfully.');
  } catch (error) {
    logger.error('Error saving form data:', error);
  }
};

module.exports = {
  validateFormData,
  saveFormData
};
