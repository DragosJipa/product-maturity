// server/routes/submitRoutes.background.js
const express = require('express');
const logger = require('../config/logger');
const { generateDetailedReport, generateJsonFromReport, generateEmailContent } = require('../utils/openAIHelpers');
const { validateFormData } = require('../utils/dataHelpers');
const { setTaskStatus } = require('../utils/statusHelpers');
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
      if (valueA === valueB) {
        return priorityOrder[keyA] - priorityOrder[keyB];
      }
      return valueA - valueB;
    });

  return {
    lowestArea: scoreEntries[0]?.[0],
    secondLowestArea: scoreEntries[1]?.[0]
  };
};

const convertTextToHTML = (text) => {
  const md = new markdownIt();
  const transformedText = text.replace(
    /\| Phase \| Goal \| Impact \|/g,
    '| # | Phase | Goal | Impact | Milestone |'
  );
  let html = md.render(transformedText);
  const cleanedHtml = html
    .replace(/<h3>/g, '<h2>')
    .replace(/<\/h3>/g, '</h2>');

  const styles = `
    <style>
      body {
        font-family: 'Roboto', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f4f4f4;
      }
      h1 { color: #000000; }
      h2 { color: #4A4A4A; }
      h3 { color: #1f5ba3; }
      p {
        font-size: 16px;
        margin-bottom: 1rem;
      }
      a {
        color: #0066cc;
        text-decoration: none;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      th, td {
        padding: 12px 16px;
        text-align: left;
        border: 1px solid #ddd;
        min-width: 120px;
      }

      /* Index column styling */
      td:first-child,
      th:first-child {
        width: 50px;
        text-align: center;
        background-color: #f8f8f8;
        font-weight: bold;
      }

      th {
        background-color: #1f5ba3;
        color: white;
        font-weight: bold;
        white-space: nowrap;
      }

      tr:nth-child(even) {
        background-color: #f8f8f8;
      }

      tr:hover {
        background-color: #f5f5f5;
      }

      /* Mobile responsiveness */
      @media screen and (max-width: 768px) {
        table {
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        th, td {
          white-space: nowrap;
        }
      }
    </style>
  `;

  const finalHtml = `<html><head>${styles}</head><body>${cleanedHtml}</body></html>`;
  return finalHtml;
};

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
    await page.setContent(html);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

router.post('/', async (req, res) => {
  const formData = req.body;
  const taskId = `task-${Date.now()}`;

  if (!validateFormData(formData)) {
    logger.warn('Invalid form submission attempt.');
    return res.status(400).json({ error: 'Invalid form submission' });
  }

  setTaskStatus(taskId, 'processing');

  res.status(202).json({ message: 'Your form has been submitted and is being processed. You will be notified once processing is complete.', taskId });
  (async () => {
    try {
      // Critical Path Processing
      const detailedReport = await generateDetailedReport(formData);
      const jsonResponse = await generateJsonFromReport(detailedReport);
      const htmlContent = convertTextToHTML(detailedReport);
      const pdfBuffer = await generatePDF(htmlContent);
      const pdfDataUri = `data:application/pdf;base64,${Buffer.from(pdfBuffer).toString('base64')}`;

      const scores = {
        total: jsonResponse?.maturity_level?.level || 0,
        strategy: jsonResponse?.maturity_level?.strategy?.level || 0,
        process: jsonResponse?.maturity_level?.processes?.level || 0,
        technology: jsonResponse?.maturity_level?.technology?.level || 0,
        culture: jsonResponse?.maturity_level?.culture?.level || 0,
      };

      // Set status to completed - frontend can proceed
      const initialResult = {
        ...jsonResponse,
        detailedReport,
        pdfDataUri
      };
      setTaskStatus(taskId, 'completed', initialResult);

      // Non-critical background operations
      if (formData.email) {
        Promise.all([
          createOrUpdateCompanyAndContact(formData),
          generateEmailContent(detailedReport),
          Promise.resolve().then(() => findLowestScoresWithPriority(scores))
        ]).then(([hubspotResult, emailContent, { lowestArea, secondLowestArea }]) => {
          if (formData.assessmentId) {
            return updateAssessmentScores(
              formData.assessmentId,
              scores,
              detailedReport,
              pdfBuffer,
              emailContent,
              lowestArea,
              secondLowestArea
            );
          }
        }).catch(error => {
          logger.error(`Error in HubSpot processing: ${error.message}`);
        });
      }

    } catch (error) {
      logger.error(`Error in primary processing: ${error.message}`);
      setTaskStatus(taskId, 'failed');
    }
  })();
});

module.exports = router;
