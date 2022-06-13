const mongoose = require("mongoose");

exports.Player = mongoose.Schema({
  id: { type: String, required: true },
  firstName: { type: String, required: true, default: "first name", trim: true },
  lastName: { type: String, required: true, default: "last name", trim: true },
  playerName: { type: String, required: true, default: "player", trim: true },
  discordTag: { type: String, required: true, default: "none#1234", trim: true },
  rank: { type: String, required: true, default: "IRON", trim: true },
  rankValue: { type: Number, required: true, default: 1, trim: true },
  primaryRole: { type: String, required: true, default: "FILL", trim: true },
  secondaryRole: { type: String, required: true, default: "FILL", trim: true },
});
