// worker.js
const { parentPort, workerData } = require('worker_threads');
const mongoose = require('mongoose');
const XLSX = require('xlsx');

const Agent = require('./models/Agent');
const User = require('./models/User');
const Account = require('./models/Account');
const Category = require('./models/Category');
const Carrier = require('./models/Carrier');
const Policy = require('./models/Policy');

async function processFile() {
  try {
    await mongoose.connect(workerData.mongoUri || 'mongodb://localhost:27017/policyDB');

    const workbook = XLSX.readFile(workerData.filePath);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of rows) {
      // 1. Agent Insertion
      let agent = await Agent.findOne({ agentName: row['agent'] || row['agentName'] });
      if (!agent && (row['agent'] || row['agentName'])) {
        agent = await Agent.create({ agentName: row['agent'] || row['agentName'] });
      }

      // 2. User Insertion
      let user = await User.findOne({ email: row['email'] });
      if (!user && row['email']) {
        user = await User.create({
          firstName: row['firstname'] || row['firstName'],
          dob: row['dob'] ? new Date(row['dob']) : null,
          address: row['address'],
          phoneNumber: row['phone'] || row['phoneNumber'],
          state: row['state'],
          zipCode: row['zip'] || row['zipCode'],
          email: row['email'],
          gender: row['gender'],
          userType: row['userType']
        });
      }

      // 3. User's Account
      let account = await Account.findOne({ accountName: row['account_name'] || row['accountName'] });
      if (!account && (row['account_name'] || row['accountName'])) {
        account = await Account.create({ accountName: row['account_name'] || row['accountName'] });
      }

      // 4. Policy Category (LOB)
      let category = await Category.findOne({ categoryName: row['category_name'] || row['categoryName'] });
      if (!category && (row['category_name'] || row['categoryName'])) {
        category = await Category.create({ categoryName: row['category_name'] || row['categoryName'] });
      }

      // 5. Policy Carrier
      let carrier = await Carrier.findOne({ companyName: row['company_name'] || row['companyName'] });
      if (!carrier && (row['company_name'] || row['companyName'])) {
        carrier = await Carrier.create({ companyName: row['company_name'] || row['companyName'] });
      }

      // 6. Policy Info
      if (row['policy_number'] || row['policyNumber']) {
        await Policy.create({
          policyNumber: row['policy_number'] || row['policyNumber'],
          policyStartDate: row['policy_start_date'] ? new Date(row['policy_start_date']) : null,
          policyEndDate: row['policy_end_date'] ? new Date(row['policy_end_date']) : null,
          categoryId: category ? category._id : null,
          companyId: carrier ? carrier._id : null,
          userId: user ? user._id : null
        });
      }
    }

    parentPort.postMessage({ success: true, message: 'Data imported successfully!' });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  } finally {
    await mongoose.connection.close();
  }
}

processFile();