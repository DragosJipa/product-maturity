const express = require('express');
const logger = require('../config/logger');
const puppeteer = require('puppeteer');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { htmlContent } = req.body; // Send HTML from client
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        logger.error(`Error generating PDF: ${error.message}`);
        res.status(500).send('Error generating PDF');
    }
});

module.exports = router;
