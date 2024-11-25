const socketIO = require('socket.io');
const Game = require('../models/Game');
const Dictionary = require('./dictionary');

class SocketManager {
    constructor(server) {
        this.io = socketIO(server, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });
        
        this.gameRooms = new Map();
        this.initialize();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('joinGame', async (gameId, userId) => {
                try {
                    const game = await Game.findById(gameId);
                    if (game) {
                        socket.join(gameId);
                        this.gameRooms.set(socket.id, gameId);
                        this.io.to(gameId).emit('playerJoined', {
                            userId,
                            gameState: game
                        });
                    }
                } catch (error) {
                    socket.emit('error', 'Failed to join game');
                }
            });

            socket.on('placeTile', async ({ gameId, position, letter, userId }) => {
                try {
                    const game = await Game.findById(gameId);
                    if (game && game.currentTurn.toString() === userId) {
                        // Update game state
                        const { row, col } = position;
                        if (!game.board[row][col]) {
                            game.board[row][col] = letter;
                            await game.save();
                            
                            this.io.to(gameId).emit('tilePlaced', {
                                position,
                                letter,
                                board: game.board
                            });
                        }
                    }
                } catch (error) {
                    socket.emit('error', 'Failed to place tile');
                }
            });

            socket.on('submitWord', async ({ gameId, word, positions, userId }) => {
                try {
                    if (Dictionary.isValidWord(word)) {
                        const game = await Game.findById(gameId);
                        if (game) {
                            const score = this.calculateWordScore(word, positions, game.board);
                            
                            // Update player's score
                            const playerIndex = game.players.findIndex(
                                p => p.userId.toString() === userId
                            );
                            if (playerIndex !== -1) {
                                game.players[playerIndex].score += score;
                                await game.save();
                                
                                this.io.to(gameId).emit('wordSubmitted', {
                                    word,
                                    score,
                                    userId,
                                    gameState: game
                                });
                            }
                        }
                    } else {
                        socket.emit('error', 'Invalid word');
                    }
                } catch (error) {
                    socket.emit('error', 'Failed to submit word');
                }
            });

            socket.on('endTurn', async ({ gameId, userId }) => {
                try {
                    const game = await Game.findById(gameId);
                    if (game) {
                        // Find next player
                        const currentPlayerIndex = game.players.findIndex(
                            p => p.userId.toString() === userId
                        );
                        const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
                        game.currentTurn = game.players[nextPlayerIndex].userId;
                        
                        await game.save();
                        this.io.to(gameId).emit('turnEnded', {
                            nextPlayer: game.currentTurn,
                            gameState: game
                        });
                    }
                } catch (error) {
                    socket.emit('error', 'Failed to end turn');
                }
            });

            socket.on('disconnect', () => {
                const gameId = this.gameRooms.get(socket.id);
                if (gameId) {
                    this.io.to(gameId).emit('playerLeft', socket.id);
                    this.gameRooms.delete(socket.id);
                }
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    calculateWordScore(word, positions, board) {
        // Implementation of score calculation
        // This should match the frontend scoring logic
        return 0; // Placeholder
    }
}

module.exports = SocketManager;
