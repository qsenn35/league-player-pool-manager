const mongoose = require('mongoose');
const { Player } = require('./Player');

exports.Pool = mongoose.model('Pool', {
  id: { type: String, required: true },
  title: { type: String, required: true },
  passwordHash: { type: String, required: true },
  players: { type: [ Player ], default: [] },
})