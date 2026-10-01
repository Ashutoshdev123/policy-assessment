# Node.js Technical Assessment Solution

This project implements a Node.js RESTful API suite for managing insurance policies, processing data files using Worker Threads, monitoring CPU usage, and scheduling background database insertion tasks.

---

## 🛠️ Key Features

### **Task 1**
1. **Data Import via Worker Threads:** Accepts XLSX/CSV file uploads and processes high-volume data concurrently off the main event loop to store into MongoDB collections.
2. **Search Policy API:** Search for user policy details by username.
3. **Aggregated Policy API:** Aggregates and lists all policies grouped by each individual user using MongoDB aggregation pipelines.
4. **Normalized Database Schemas:** Data is structured across 6 distinct MongoDB collections (`Agent`, `User`, `Account`, `Category`, `Carrier`, `Policy`).

### **Task 2**
1. **Real-time CPU Monitoring:** Continuously tracks Node.js server CPU usage and gracefully triggers a process exit/restart when CPU utilization exceeds **70%**.
2. **Scheduled Insertion Service:** Post service that accepts a message, date (`YYYY-MM-DD`), and time (`HH:MM`) to automatically write the message to MongoDB at the exact target schedule.

---

## 📂 Project Structure

```text
policy-assessment/
├── config/
│   └── db.js               # Database connection configuration
├── models/
│   ├── Agent.js            # Agent collection schema
│   ├── User.js             # User collection schema
│   ├── Account.js          # User's Account collection schema
│   ├── Category.js         # Policy Category (LOB) schema
│   ├── Carrier.js          # Policy Carrier schema
│   ├── Policy.js           # Policy Info collection schema
│   └── ScheduledMessage.js # Scheduled messages collection schema
├── routes/
│   ├── uploadRoutes.js     # File upload & Worker Thread route
│   ├── policyRoutes.js     # Search & Aggregation routes
│   └── messageRoutes.js    # Scheduled message post route
├── utils/
│   └── cpuMonitor.js       # Real-time CPU usage monitoring logic
├── worker.js               # Worker Thread script for parsing Excel/CSV
├── server.js               # Express application entry point
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation