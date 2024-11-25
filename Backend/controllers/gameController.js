const Game = require('../models/Game');
const { validateWord, calculateScore } = require('../utils/gameLogic');

const gameController = {
    async createGame(req, res) {
        try {
            const game = new Game({
                players: [{ userId: req.userId, score: 0 }],
                status: 'waiting',
                currentTurn: req.userId
            });
            await game.save();
            res.status(201).json(game);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create game' });
        }
    },

    async joinGame(req, res) {
        try {
            const { gameId } = req.params;
            const game = await Game.findById(gameId);
            
            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }
            
            if (game.players.length >= 4) {
                return res.status(400).json({ error: 'Game is full' });
            }

            game.players.push({ userId: req.userId, score: 0 });
            await game.save();
            
            res.json(game);
        } catch (error) {
            res.status(500).json({ error: 'Failed to join game' });
        }
    },

    async saveGameState(req, res) {
        try {
            const { gameId } = req.params;
            const { board, rack, score, moves } = req.body;
            
            const game = await Game.findById(gameId);
            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }

            game.board = board;
            game.players.forEach(player => {
                if (player.userId.toString() === req.userId) {
                    player.rack = rack;
                    player.score = score;
                }
            });
            game.moves.push(...moves);
            
            await game.save();
            res.json(game);
        } catch (error) {
            res.status(500).json({ error: 'Failed to save game state' });
        }
    },

    async loadGameState(req, res) {
        try {
            const { gameId } = req.params;
            const game = await Game.findById(gameId)
                .populate('players.userId', 'username');
            
            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }

            res.json(game);
        } catch (error) {
            res.status(500).json({ error: 'Failed to load game state' });
        }
    },

    async validateMove(req, res) {
        try {
            const { word, position } = req.body;
            
            if (!validateWord(word)) {
                return res.status(400).json({ 
                    error: 'Invalid word',
                    valid: false 
                });
            }

            const score = calculateScore(word, position);
            
            res.json({ 
                valid: true,
                score,
                word
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to validate move' });
        }
    }
};

module.exports = gameController;
