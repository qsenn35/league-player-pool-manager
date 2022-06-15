const mongoose = require('mongoose');
const { Player } = require('./Player');

exports.Pool = mongoose.model('Pool', {
  id: { type: String, required: true },
  creator: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now() },
  title: { type: String, required: true },
  players: { type: [ Player ], default: [] },
  teams: { type: [], default: [] }
});