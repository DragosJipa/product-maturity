const sgMail = require('@sendgrid/mail');
const express = require('express');
const logger = require('../config/logger');

const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.post('/', async (req, res) => {
    try {
        const { pdf, email } = req.body;
        const cleanBase64 = pdf.replace(/^data:application\/pdf;base64,/, '');

        const msg = {
            to: email,
            from: {
                email: 'dragos.jipa@moduscreate.com',
                name: 'Product Maturity Assessment'
            },
            subject: 'Your Product Maturity Assessment Report',
            text: 'Thank you for completing the Product Maturity Assessment. Please find your detailed report attached.',
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Product Maturity Assessment Report</h2>
                    <p>Thank you for completing the assessment. Your detailed report is ready.</p>
                    <p>Best regards,<br>Product Maturity Assessment Team</p>
                </div>
            `,
            attachments: [
                {
                    content: cleanBase64,
                    filename: 'product-maturity-assessment-report.pdf',
                    type: 'application/pdf',
                    disposition: 'attachment'
                }
            ]
        }
        await sgMail.send(msg);
        res.json({ status: 'success', message: 'Email sent successfully' });
    } catch (error) {
        logger.error(`Error sending mail: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Failed to send email.' });
    }
});

module.exports = router;