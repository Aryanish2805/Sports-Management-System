const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sport_type: { type: String, enum: ['Football', 'Cricket', 'Basketball', 'Tennis', 'Volleyball', 'Other'], required: true },
  description: { type: String, default: '' },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  max_teams: { type: Number, default: 8 },
  format: { type: String, enum: ['league', 'knockout', 'group_stage'], default: 'league' },
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
