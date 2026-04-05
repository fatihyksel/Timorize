const express = require('express');
const { deleteAccount } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.delete('/:userid', authMiddleware, deleteAccount);

module.exports = router;
