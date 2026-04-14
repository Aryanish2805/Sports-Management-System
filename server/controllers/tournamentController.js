const Tournament = require('../models/Tournament');

// GET /api/tournaments
const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find().populate('organizer', 'name email').sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/tournaments/:id
const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id).populate('organizer', 'name email');
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });
    res.json(tournament);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/tournaments
const createTournament = async (req, res) => {
  try {
    const { name, sport_type, description, start_date, end_date, max_teams, format } = req.body;
    const tournament = await Tournament.create({
      name, sport_type, description, start_date, end_date,
      max_teams, format, organizer: req.user._id,
    });
    res.status(201).json(tournament);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/tournaments/:id
const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });
    res.json(tournament);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/tournaments/:id
const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });
    res.json({ message: 'Tournament deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getTournaments, getTournamentById, createTournament, updateTournament, deleteTournament };
