// server/routes/submitRoutes.background.js
const express = require('express');
const logger = require('../config/logger'); // Import logger
const { generateDetailedReport, generateJsonFromReport } = require('../utils/openAIHelpers'); // Import OpenAI helpers
const { validateFormData, saveFormData } = require('../utils/dataHelpers'); // Import data helpers
const { setTaskStatus, getTaskStatus } = require('../utils/statusHelpers'); // Import status helpers
const { createOrUpdateCompanyAndContact } = require('../integrations/hubspotUtils');

const router = express.Router();

// Endpoint to handle form submission
router.post('/', async (req, res) => {
  const formData = req.body;
  const taskId = `task-${Date.now()}`; // Generate a unique task ID

  // console.log('Task ID generated:', taskId);  // Log the task ID
  if (!validateFormData(formData)) {
    logger.warn('Invalid form submission attempt.');
    return res.status(400).json({ error: 'Invalid form submission' });
  }

  logger.info(`Received form submission: ${JSON.stringify(formData)}`);

  try {
    saveFormData(formData);

    if (formData.email) {
      try {
        const hubspotResult = await createOrUpdateCompanyAndContact(formData);
        console.log('HubSpot records created/updated:', hubspotResult);
      } catch (error) {
        logger.error(`Error creating HubSpot records: ${error.message}`);
      }
    }
  } catch (error) {
    logger.error(`Error saving form data: ${error.message}`);
    return res.status(500).json({ error: 'Failed to save form data' });
  }

  // Set the initial status to 'processing'
  setTaskStatus(taskId, 'processing');

  // Immediately respond to the client with task ID and initial status
  res.status(202).json({ message: 'Your form has been submitted and is being processed. You will be notified once processing is complete.', taskId });

  // Perform async processing in background
  (async () => {
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

      const finalResult = {
        ...jsonResponse,
        detailedReport: detailedReport, // Include detailed report in final output
      };

      // Update the status to 'completed' and store the result
      setTaskStatus(taskId, 'completed', finalResult);

      // log TaskID and its status
      logger.info(`Task ID: ${taskId} - Status: ${getTaskStatus(taskId).status}`);

    } catch (error) {
      logger.error(`Error processing with OpenAI in background: ${error.message}`);
      setTaskStatus(taskId, 'failed'); // Update status to 'failed' if there's an error
    }
  })();
});

module.exports = router;
