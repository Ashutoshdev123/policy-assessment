const express = require('express');
const connectDB = require('./config/db.js')
const monitorCPU = require('./utils/cpuMonitor.js');

const uploadRoutes = require('./routes/uploadRoutes.js');
const policyRoutes = require('./routes/policyRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Task 2 (1): Start CPU Monitoring
monitorCPU();

// Register Routes
app.use('/api', uploadRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});