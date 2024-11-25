const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    currentGame: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    score: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Player', playerSchema);
