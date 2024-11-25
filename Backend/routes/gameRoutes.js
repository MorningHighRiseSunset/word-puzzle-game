const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Public routes - no authentication required
router.post('/lobby/join', gameController.joinLobby);
router.post('/create', gameController.createGame);
router.post('/join', gameController.joinGame);
router.get('/games', gameController.getGames);
router.post('/move', gameController.makeMove);

module.exports = router;
