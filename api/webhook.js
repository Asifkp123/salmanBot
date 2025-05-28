// filepath: [project-name]/api/webhook.js
const express = require('express');
const router = express.Router();

// Function to handle webhook requests
router.post('/webhook', (req, res) => {
    const data = req.body;

    // Process the incoming data
    console.log('Webhook received:', data);

    // Respond to the webhook request
    res.status(200).send('Webhook processed');
});

module.exports = router;