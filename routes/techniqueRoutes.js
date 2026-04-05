const express = require('express');
const {
  selectTechnique,
  addFavoriteTechnique,
} = require('../controllers/techniqueController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/select', authMiddleware, selectTechnique);
router.post('/favorite', authMiddleware, addFavoriteTechnique);

module.exports = router;
