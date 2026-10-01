const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Carrier = require('../models/Carrier');
const Policy = require('../models/Policy');


// Task 1 (2): Search API to find policy info by username (firstName)
router.get('/search', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: 'Username query parameter is required.' });
    }
     

    const users = await User.find({ firstName: new RegExp(username, 'i') });
 
    const userIds = users.map(u => u._id);



    const policies = await Policy.find({ userId: { $in: userIds } })
     .populate('userId')
     .populate('categoryId')
     .populate('companyId');

    res.status(200).json({ count: policies.length, policies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Task 1 (3): API to provide aggregated policy by each user
router.get('/aggregate-by-user', async (req, res) => {
  try {
    const aggregatedData = await Policy.aggregate([
      {
        $group: {
          _id: '$userId',
          totalPolicies: { $sum: 1 },
          policies: {
            $push: {
              policyNumber: '$policyNumber',
              policyStartDate: '$policyStartDate',
              policyEndDate: '$policyEndDate'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          user: '$userDetails',
          totalPolicies: 1,
          policies: 1
        }
      }
    ]);

    res.status(200).json({ data: aggregatedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;