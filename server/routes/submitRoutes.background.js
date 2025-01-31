// server/routes/submitRoutes.background.js
const express = require('express');
const logger = require('../config/logger'); // Import logger
const { generateDetailedReport, generateJsonFromReport, generateEmailContent } = require('../utils/openAIHelpers'); // Import OpenAI helpers
const { validateFormData, saveFormData } = require('../utils/dataHelpers'); // Import data helpers
const { setTaskStatus, getTaskStatus } = require('../utils/statusHelpers'); // Import status helpers
const { createOrUpdateCompanyAndContact, updateAssessmentScores } = require('../integrations/hubspotUtils');
const puppeteer = require('puppeteer');
const markdownIt = require('markdown-it');

const router = express.Router();

const findLowestScoresWithPriority = (scores) => {
  const priorityOrder = {
    strategy: 1,
    process: 2,
    culture: 3,
    technology: 4
  };

  const scoreEntries = Object.entries(scores)
    .filter(([key]) => key !== 'total')
    .sort(([keyA, valueA], [keyB, valueB]) => {
      // If values are equal, use priority order
      if (valueA === valueB) {
        return priorityOrder[keyA] - priorityOrder[keyB];
      }
      // Otherwise sort by value
      return valueA - valueB;
    });

  return {
    lowestArea: scoreEntries[0]?.[0],
    secondLowestArea: scoreEntries[1]?.[0]
  };
};

const convertTextToHTML = (text) => {
  // Initialize markdown-it
  const md = new markdownIt();

  // Convert Markdown to HTML
  const html = md.render(text);

  // Blog CSS styles (Manually extracted or linked from the blog's stylesheet)
  const styles = `
    <style>
      body {
        font-family: 'Roboto', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f4f4f4;
      }
      h1 {
        color: #000000;  /* Keep main title (h1) blue */
      }
      h2 {
        color: #4A4A4A;  /* Change sub-chapter titles (h2) to dark grey */
      }
      h3 {
        color: #1f5ba3;  /* Keep subheadings (h3) in blue, if needed */
      }
      p {
        font-size: 16px;
        margin-bottom: 1rem;
      }
      a {
        color: #0066cc;
        text-decoration: none;
      }
      /* Additional styles based on the blog's layout */
    </style>
  `;

  // Additional processing to replace specific elements
  const cleanedHtml = html.replace(/<h3>/g, '<h2>').replace(/<\/h3>/g, '</h2>');

  // Wrap the HTML content with styles
  const finalHtml = `<html><head>${styles}</head><body>${cleanedHtml}</body></html>`;

  return finalHtml;
};


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
    // await page.setContent(`<html><body>${html}</body></html>`);
    await page.setContent(html);
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
      // const rtfContent = generateRTF(detailedReport);
      // const htmlContent = rtfToHTML(rtfContent);
      const htmlContent = convertTextToHTML(detailedReport);

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

      let emailContent = '';
      try {
        emailContent = await generateEmailContent(detailedReport);
        console.log('Generated email content:', emailContent);
      } catch (error) {
        logger.error(`Error generating email content: ${error.message}`);
      }

      const { lowestArea, secondLowestArea } = findLowestScoresWithPriority(scores);

      if (formData.assessmentId) {
        try {
          const hubspotResult = await updateAssessmentScores(formData.assessmentId, scores, detailedReport, pdfBuffer, emailContent, lowestArea, secondLowestArea);
          console.log('HubSpot assessment updated:', hubspotResult);
        } catch (error) {
          logger.error(`Error updating HubSpot assessment: ${error.message}`);
        }
      }


      const finalResult = {
        ...jsonResponse,
        detailedReport: detailedReport,
        pdfDataUri,
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
