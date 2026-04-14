const Team = require('../models/Team');

// GET /api/teams
const getTeams = async (req, res) => {
  try {
    const filter = req.query.tournament ? { tournament: req.query.tournament } : {};
    const teams = await Team.find(filter).populate('tournament', 'name sport_type').populate('manager', 'name email').sort({ createdAt: -1 });
    res.json(teams);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/teams/:id
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('tournament', 'name sport_type').populate('manager', 'name email');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/teams
const createTeam = async (req, res) => {
  try {
    const { name, tournament, contact_info, members, logo_color } = req.body;
    const team = await Team.create({ name, tournament, contact_info, members, logo_color, manager: req.user._id });
    res.status(201).json(team);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/teams/:id
const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/teams/:id
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json({ message: 'Team deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getTeams, getTeamById, createTeam, updateTeam, deleteTeam };
