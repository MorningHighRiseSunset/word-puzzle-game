const Game = require('../models/Game');
const Player = require('../models/Player');
const { validateWord, calculateScore } = require('../utils/gameLogic');

const gameController = {
    // Create or join lobby
    async joinLobby(req, res) {
        try {
            const { playerName, sessionId } = req.body;
            
            let player = await Player.findOne({ sessionId });
            
            if (!player) {
                player = new Player({
                    name: playerName,
                    sessionId,
                    isActive: true
                });
                await player.save();
            } else {
                player.name = playerName;
                player.isActive = true;
                await player.save();
            }

            res.json({ 
                success: true, 
                player,
                message: 'Joined lobby successfully' 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to join lobby' 
            });
        }
    },

    // Create new game
    async createGame(req, res) {
        try {
            const { sessionId } = req.body;
            const player = await Player.findOne({ sessionId });
            
            if (!player) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Player not found' 
                });
            }

            const game = new Game({
                players: [{ 
                    playerId: player._id,
                    name: player.name,
                    score: 0,
                    rack: []
                }],
                status: 'waiting',
                currentTurn: player._id
            });

            await game.save();
            
            player.currentGame = game._id;
            await player.save();

            res.json({ 
                success: true, 
                gameId: game._id,
                game
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to create game' 
            });
        }
    },

    // Join existing game
    async joinGame(req, res) {
        try {
            const { gameId, sessionId } = req.body;
            const player = await Player.findOne({ sessionId });
            const game = await Game.findById(gameId);

            if (!game) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Game not found' 
                });
            }

            if (game.players.length >= 4) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Game is full' 
                });
            }

            game.players.push({
                playerId: player._id,
                name: player.name,
                score: 0,
                rack: []
            });

            if (game.players.length === 2) {
                game.status = 'active';
            }

            await game.save();
            
            player.currentGame = game._id;
            await player.save();

            res.json({ 
                success: true, 
                game 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to join game' 
            });
        }
    },

    // Get available games
    async getGames(req, res) {
        try {
            const games = await Game.find({ 
                status: 'waiting'
            }).populate('players.playerId', 'name');

            res.json({ 
                success: true, 
                games 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to get games' 
            });
        }
    },

    // Make a move
    async makeMove(req, res) {
        try {
            const { gameId, sessionId, word, position } = req.body;
            const player = await Player.findOne({ sessionId });
            const game = await Game.findById(gameId);

            if (!game || !player) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Game or player not found' 
                });
            }

            if (game.currentTurn.toString() !== player._id.toString()) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Not your turn' 
                });
            }

            if (validateWord(word)) {
                const score = calculateScore(word, position);
                const playerIndex = game.players.findIndex(
                    p => p.playerId.toString() === player._id.toString()
                );

                game.players[playerIndex].score += score;
                game.moves.push({
                    playerId: player._id,
                    word,
                    score,
                    position
                });

                // Update current turn
                const nextPlayerIndex = (playerIndex + 1) % game.players.length;
                game.currentTurn = game.players[nextPlayerIndex].playerId;

                await game.save();

                res.json({ 
                    success: true, 
                    game, 
                    score 
                });
            } else {
                res.status(400).json({ 
                    success: false, 
                    error: 'Invalid word' 
                });
            }
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to make move' 
            });
        }
    }
};

module.exports = gameController;
