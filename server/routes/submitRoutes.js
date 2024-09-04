// server/routes/submitRoutes.js

const express = require('express');
const logger = require('../config/logger'); // Import logger
const { generateDetailedReport, generateJsonFromReport } = require('../utils/openAIHelpers'); // Import OpenAI helpers
const { validateFormData, saveFormData } = require('../utils/dataHelpers'); // Import data helpers

const router = express.Router();

// Endpoint to handle form submission
router.post('/', async (req, res) => {
  const formData = req.body;

  if (!validateFormData(formData)) {
    logger.warn('Invalid form submission attempt.');
    return res.status(400).json({ error: 'Invalid form submission' });
  }

  logger.info(`Received form submission: ${JSON.stringify(formData)}`);

  // Save form responses
  saveFormData(formData);

  try {
    // Step 1: Generate detailed report
    const detailedReport = await generateDetailedReport(formData);
    if (!detailedReport) {
      throw new Error('Failed to generate detailed report.');
    }
    logger.info(`Generated Detailed Report: \n ${detailedReport}`);

    // Step 2: Generate JSON output from the detailed report
    const jsonResponse = await generateJsonFromReport(detailedReport);
    if (!jsonResponse) {
      throw new Error('Failed to generate JSON from the detailed report.');
    }
    logger.info(`Generated JSON Response: \n ${JSON.stringify(jsonResponse, null, 2)}`);

    // Include detailedReport in the response
    res.status(200).json({
      message: 'Response submitted successfully!',
      interpretation: jsonResponse,
      detailedReport: detailedReport, // Add detailed report to response
    });
  } catch (error) {
    logger.error(`Error processing with OpenAI: ${error.message}`);
    res.status(500).json({ error: 'Failed to process with OpenAI' });
  }
});

module.exports = router;
