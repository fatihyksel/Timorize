const express = require('express');
const {
  createTimer,
  listTimeLogs,
  deleteTimeLog,
} = require('../controllers/timerController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/logs', authMiddleware, listTimeLogs);
router.delete('/logs/:logid', authMiddleware, deleteTimeLog);
router.post('/', authMiddleware, createTimer);

module.exports = router;
