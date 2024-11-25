const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  players: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, default: 0 },
    rack: [String]
  }],
  board: [[{
    letter: String,
    multiplier: {
      type: String,
      enum: ['none', 'DL', 'TL', 'DW', 'TW'],
      default: 'none'
    }
  }]],
  bagOfTiles: [String],
  currentTurn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed'],
    default: 'waiting'
  },
  moves: [{
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    word: String,
    score: Number,
    position: {
      row: Number,
      col: Number,
      direction: String
    },
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Game', gameSchema);
