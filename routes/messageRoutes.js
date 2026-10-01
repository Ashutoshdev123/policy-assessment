const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const ScheduledMessage = require('../models/ScheduledMessage.js');

// Task 2 (2): Post service to insert message at given day & time
// Expects body: { "message": "Hello World", "day": "YYYY-MM-DD", "time": "HH:MM" }
router.post('/schedule-message', async (req, res) => {
  try {
    const { message, day, time } = req.body;

    if (!message || !day || !time) {
      return res.status(400).json({ error: 'message, day (YYYY-MM-DD), and time (HH:MM) are required.' });
    }

    const targetDate = new Date(`${day}T${time}:00`);

    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date/time format.' });
    }

    const now = new Date();
    const delay = targetDate.getTime() - now.getTime();

    if (delay <= 0) {
      return res.status(400).json({ error: 'Scheduled time must be in the future.' });
    }

    // Schedule insertion
    setTimeout(async () => {
      try {
        await ScheduledMessage.create({
          message,
          scheduledTime: targetDate
        });
        console.log(`✅ Scheduled message inserted successfully at ${new Date().toISOString()}`);
      } catch (err) {
        console.error('Failed to insert scheduled message:', err);
      }
    }, delay);

    res.status(200).json({
      status: 'Scheduled',
      message: `Message will be inserted at ${targetDate.toISOString()}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;