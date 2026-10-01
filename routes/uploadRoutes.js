const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Worker } = require('worker_threads');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

// Task 1 (1): API to upload XLSX/CSV using Worker Threads
router.post('/upload', upload.single('file'), (req, res) => {
  console.log("req file ", req.file);
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload an Excel or CSV file.' });
  }

  const worker = new Worker(path.join(__dirname, '../worker.js'), {
    workerData: {
      filePath: req.file.path,
      mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/policyDB'
    }
  });

  worker.on('message', (result) => {
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(500).json({ error: result.error });
    }
  });

  worker.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

module.exports = router;