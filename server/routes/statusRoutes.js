// server/routes/statusRoutes.js
const express = require('express');
const logger = require('../config/logger'); // Import logger
const { getTaskStatus } = require('../utils/statusHelpers'); // Import helper function to get processing status

const router = express.Router();

// Endpoint to check processing status
router.get('/result-status/:taskId', async (req, res) => {
    res.set('Cache-Control', 'no-store'); // Disable caching for this route

    const taskId = req.params.taskId; // Extract taskId from the request parameters

    try {
        const taskInfo = getTaskStatus(taskId); // Fetch the task status using the provided taskId

        if (taskInfo.status === 'completed') {
            return res.status(200).json({
                status: 'completed',
                result: taskInfo.result
            });
        } else if (taskInfo.status === 'processing') {
            return res.status(200).json({ status: 'processing' });
        } else if (taskInfo.status === 'failed') {
            return res.status(500).json({ status: 'failed', message: 'Processing failed' });
        } else {
            return res.status(404).json({ status: 'not_found', message: 'Task not found' });
        }
    } catch (error) {
        logger.error(`Error checking processing status: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve processing status' });
    }
});

module.exports = router;
