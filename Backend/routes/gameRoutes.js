const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Game management
router.post('/create', gameController.createGame);
router.post('/join/:gameId', gameController.joinGame);
router.post('/save/:gameId', gameController.saveGameState);
router.get('/load/:gameId', gameController.loadGameState);
router.post('/validate', gameController.validateMove);

module.exports = router;
