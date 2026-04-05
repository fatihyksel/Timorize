const express = require('express');
const {
  createDailyPlan,
  updateDailyPlan,
  getDailyPlans,
} = require('../controllers/planController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createDailyPlan);
router.put('/:planid', authMiddleware, updateDailyPlan);
router.get('/', authMiddleware, getDailyPlans);

module.exports = router;
