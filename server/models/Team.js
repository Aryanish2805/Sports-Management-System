const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contact_info: { type: String, default: '' },
  members: [{ type: String }],
  logo_color: { type: String, default: '#3b82f6' },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
