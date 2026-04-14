const Match = require('../models/Match');
const Standing = require('../models/Standing');

// GET /api/matches
const getMatches = async (req, res) => {
  try {
    const filter = req.query.tournament ? { tournament: req.query.tournament } : {};
    const matches = await Match.find(filter)
      .populate('tournament', 'name sport_type')
      .populate('team1', 'name logo_color')
      .populate('team2', 'name logo_color')
      .populate('winner', 'name')
      .sort({ date: 1 });
    res.json(matches);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/matches/:id
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('tournament', 'name sport_type')
      .populate('team1', 'name logo_color')
      .populate('team2', 'name logo_color')
      .populate('winner', 'name');
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/matches
const createMatch = async (req, res) => {
  try {
    const { tournament, team1, team2, date, venue, round } = req.body;
    const match = await Match.create({ tournament, team1, team2, date, venue, round });
    res.status(201).json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/matches/:id/score  — update score + auto-update standings
const updateScore = async (req, res) => {
  try {
    const { score1, score2, status } = req.body;
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    const wasCompleted = match.status === 'completed';

    // Determine winner
    let winner = null;
    if (score1 > score2) winner = match.team1;
    else if (score2 > score1) winner = match.team2;

    match.score1 = score1;
    match.score2 = score2;
    match.status = status || 'completed';
    match.winner = winner;
    await match.save();

    // Update standings only when marking as completed for first time
    if (!wasCompleted && match.status === 'completed') {
      const updateStanding = async (teamId, goalsFor, goalsAgainst, result) => {
        const standing = await Standing.findOneAndUpdate(
          { tournament: match.tournament, team: teamId },
          {
            $inc: {
              played: 1,
              wins: result === 'win' ? 1 : 0,
              losses: result === 'loss' ? 1 : 0,
              draws: result === 'draw' ? 1 : 0,
              goals_for: goalsFor,
              goals_against: goalsAgainst,
              points: result === 'win' ? 3 : result === 'draw' ? 1 : 0,
            }
          },
          { upsert: true, new: true }
        );
        return standing;
      };

      if (score1 > score2) {
        await updateStanding(match.team1, score1, score2, 'win');
        await updateStanding(match.team2, score2, score1, 'loss');
      } else if (score2 > score1) {
        await updateStanding(match.team1, score1, score2, 'loss');
        await updateStanding(match.team2, score2, score1, 'win');
      } else {
        await updateStanding(match.team1, score1, score2, 'draw');
        await updateStanding(match.team2, score2, score1, 'draw');
      }
    }

    const updated = await Match.findById(req.params.id)
      .populate('team1', 'name').populate('team2', 'name').populate('winner', 'name');
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/matches/:id
const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json({ message: 'Match deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getMatches, getMatchById, createMatch, updateScore, deleteMatch };
