const express = require('express');
const logger = require('../config/logger');
const { handleEmailSubmission } = require('../integrations/hubspotUtils');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        let hubspot = null;
        if (email) {
            hubspot = await handleEmailSubmission(email);
            console.log('HubSpot records created/updated:', hubspot);
        }

        res.json(hubspot);
    } catch (error) {
        logger.error(`Error sending email to hubspot: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Failed to send email.' });
    }
});


module.exports = router;