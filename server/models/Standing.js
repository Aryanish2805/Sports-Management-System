const mongoose = require('mongoose');

const standingSchema = new mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  played: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  goals_for: { type: Number, default: 0 },
  goals_against: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
}, { timestamps: true });

standingSchema.index({ tournament: 1, team: 1 }, { unique: true });

module.exports = mongoose.model('Standing', standingSchema);
