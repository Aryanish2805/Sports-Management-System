const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  team1: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  team2: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  score1: { type: Number, default: 0 },
  score2: { type: Number, default: 0 },
  date: { type: Date, required: true },
  venue: { type: String, default: 'TBD' },
  status: { type: String, enum: ['scheduled', 'ongoing', 'completed'], default: 'scheduled' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  round: { type: String, default: 'Group Stage' },
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
