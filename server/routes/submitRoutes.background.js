// server/routes/submitRoutes.background.js
const express = require('express');
const logger = require('../config/logger'); // Import logger
const { generateDetailedReport, generateJsonFromReport } = require('../utils/openAIHelpers'); // Import OpenAI helpers
const { validateFormData, saveFormData } = require('../utils/dataHelpers'); // Import data helpers
const { setTaskStatus, getTaskStatus } = require('../utils/statusHelpers'); // Import status helpers
const { createOrUpdateCompanyAndContact, updateAssessmentScores } = require('../integrations/hubspotUtils');
const puppeteer = require('puppeteer');

const router = express.Router();

// Generate an RTF document
const generateRTF = (plainText) => {
  console.log('im in generateRTF,', plainText);

  // Wrap text in RTF syntax with some basic styling
  return `
${plainText
      .replace(/# (.*?)\n/g, '\\b \\fs36 $1\\b0\\par\n') // Header 1
      .replace(/## (.*?)\n/g, '\\b \\fs28 $1\\b0\\par\n') // Header 2
      .replace(/\*\*(.*?)\*\*/g, '\\b $1\\b0') // Bold text
      .replace(/\n/g, '\\par\n')}
`;
};

// Convert RTF content to a basic HTML structure
const rtfToHTML = (rtf) => {
  return rtf
    .replace(/\\b(.*?)\\b0/g, '<b>$1</b>') // Convert bold text
    .replace(/\\fs36 (.*?)\\par/g, '<h1>$1</h1>') // Convert Header 1
    .replace(/\\fs28 (.*?)\\par/g, '<h2>$1</h2>') // Convert Header 2
    .replace(/\\par/g, '<br>'); // Convert paragraphs
};


// Generate PDF from HTML with proper Puppeteer configuration
const generatePDF = async (html) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ],
    executablePath: process.env.PUPPETEER_EXEC_PATH
  });

  try {
    const page = await browser.newPage();
    await page.setContent(`<html><body>${html}</body></html>`);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });
    return pdfBuffer;
  } finally {
    await browser.close(); // Ensure browser closes even if error occurs
  }
};
// const generatePDF = async (html) => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.setContent(`<html><body>${html}</body></html>`);

//   const pdfBuffer = await page.pdf({ format: 'A4' });

//   await browser.close();

//   return pdfBuffer;
// };

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
      const rtfContent = generateRTF(detailedReport);
      const htmlContent = rtfToHTML(rtfContent);

      const pdfBuffer = await generatePDF(htmlContent);
      // Convert to proper Base64
      const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
      // Add data URI prefix
      const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

      // Step 2: Generate JSON output from the detailed report
      const jsonResponse = await generateJsonFromReport(detailedReport);
      if (!jsonResponse) {
        throw new Error('Failed to generate JSON from the detailed report.');
      }
      logger.info(`Generated JSON Response: \n ${JSON.stringify(jsonResponse, null, 2)}`);

      const scores = {
        total: jsonResponse?.maturity_level?.level || 0,
        strategy: jsonResponse?.maturity_level?.strategy?.level || 0,
        process: jsonResponse?.maturity_level?.processes?.level || 0,
        technology: jsonResponse?.maturity_level?.technology?.level || 0,
        culture: jsonResponse?.maturity_level?.culture?.level || 0,
      }

      if (formData.assessmentId) {
        try {
          const hubspotResult = await updateAssessmentScores(formData.assessmentId, scores);
          console.log('HubSpot assessment updated:', hubspotResult);
        } catch (error) {
          logger.error(`Error updating HubSpot assessment: ${error.message}`);
        }
      }

      const finalResult = {
        ...jsonResponse,
        detailedReport: detailedReport,
        pdf: pdfDataUri,
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
