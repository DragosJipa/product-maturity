const fs = require('fs');
const path = require('path');
const logger = require('../config/logger'); // Import logger

// Use /tmp directory in serverless environments like Vercel
const DB_FILE = path.join(process.env.NODE_ENV === 'development' ? '.' : '/tmp', 'responses.json');

// Helper function to validate form data
const validateFormData = (data) => {
  return typeof data === 'object' && data !== null && Object.keys(data).length > 0;
};

// Updated Helper function to save form data (clears previous records first)
const saveFormData = (formData) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify([formData], null, 2)); // Save only the new formData
    logger.info('Previous data cleared. New form data saved successfully.');
  } catch (error) {
    logger.error('Error saving form data:', error);
    throw new Error('Failed to save form data.'); // Throw an error to handle it appropriately in your routes
  }
};

module.exports = {
  validateFormData,
  saveFormData
};
