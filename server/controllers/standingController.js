const Standing = require('../models/Standing');

// GET /api/standings?tournament=id
const getStandings = async (req, res) => {
  try {
    const filter = req.query.tournament ? { tournament: req.query.tournament } : {};
    const standings = await Standing.find(filter)
      .populate('team', 'name logo_color')
      .populate('tournament', 'name sport_type')
      .sort({ points: -1, wins: -1, goals_for: -1 });
    res.json(standings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getStandings };
