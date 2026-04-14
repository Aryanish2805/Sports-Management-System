const express = require('express');
const router = express.Router();
const { getTeams, getTeamById, createTeam, updateTeam, deleteTeam } = require('../controllers/teamController');
const { protect, adminOnly, managerOrAdmin } = require('../middleware/auth');

router.get('/', getTeams);
router.get('/:id', getTeamById);
router.post('/', protect, managerOrAdmin, createTeam);
router.put('/:id', protect, managerOrAdmin, updateTeam);
router.delete('/:id', protect, adminOnly, deleteTeam);

module.exports = router;
