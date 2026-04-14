const express = require('express');
const router = express.Router();
const { getMatches, getMatchById, createMatch, updateScore, deleteMatch } = require('../controllers/matchController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getMatches);
router.get('/:id', getMatchById);
router.post('/', protect, adminOnly, createMatch);
router.put('/:id/score', protect, adminOnly, updateScore);
router.delete('/:id', protect, adminOnly, deleteMatch);

module.exports = router;
