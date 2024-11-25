const socketIO = require('socket.io');
const { createLetterBag } = require('./letterDistribution');

class SocketManager {
    constructor(server) {
        this.io = socketIO(server, {
            cors: {
                origin: "https://word-puzzle-frontend.onrender.com",
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        
        this.gameRooms = new Map();
        this.playerSockets = new Map();
        this.initialize();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('createGame', ({ playerName }) => {
                const gameId = Math.random().toString(36).substring(7);
                const letterBag = createLetterBag();
                const initialRack = this.drawTiles(letterBag, 7);

                const gameState = {
                    id: gameId,
                    players: [{
                        id: socket.id,
                        name: playerName,
                        rack: initialRack,
                        score: 0
                    }],
                    board: Array(15).fill().map(() => Array(15).fill(null)),
                    currentTurn: null,
                    status: 'waiting',
                    letterBag: letterBag,
                    moves: []
                };

                this.gameRooms.set(gameId, gameState);
                this.playerSockets.set(socket.id, gameId);
                
                socket.join(gameId);
                socket.emit('gameCreated', { gameId, gameState });
                this.broadcastGamesList();
            });

            socket.on('joinGame', ({ gameId, playerName }) => {
                const game = this.gameRooms.get(gameId);
                if (game && game.status === 'waiting' && game.players.length < 4) {
                    const initialRack = this.drawTiles(game.letterBag, 7);
                    
                    game.players.push({
                        id: socket.id,
                        name: playerName,
                        rack: initialRack,
                        score: 0
                    });

                    this.playerSockets.set(socket.id, gameId);
                    socket.join(gameId);

                    if (game.players.length === 2) {
                        game.status = 'active';
                        game.currentTurn = game.players[0].id;
                    }

                    this.io.to(gameId).emit('gameUpdate', game);
                    this.broadcastGamesList();
                }
            });

            socket.on('placeTile', ({ gameId, position, letter }) => {
                const game = this.gameRooms.get(gameId);
                if (game && game.status === 'active' && game.currentTurn === socket.id) {
                    const player = game.players.find(p => p.id === socket.id);
                    const letterIndex = player.rack.indexOf(letter);

                    if (letterIndex !== -1) {
                        const { row, col } = position;
                        if (!game.board[row][col]) {
                            // Place tile on board
                            game.board[row][col] = letter;
                            // Remove tile from player's rack
                            player.rack.splice(letterIndex, 1);
                            // Draw new tile
                            const newTile = this.drawTiles(game.letterBag, 1)[0];
                            if (newTile) player.rack.push(newTile);

                            this.io.to(gameId).emit('gameUpdate', game);
                        }
                    }
                }
            });

            socket.on('endTurn', ({ gameId }) => {
                const game = this.gameRooms.get(gameId);
                if (game && game.status === 'active' && game.currentTurn === socket.id) {
                    const currentPlayerIndex = game.players.findIndex(p => p.id === socket.id);
                    const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
                    game.currentTurn = game.players[nextPlayerIndex].id;

                    this.io.to(gameId).emit('gameUpdate', game);
                }
            });

            socket.on('getGames', () => {
                this.broadcastGamesList();
            });

            socket.on('disconnect', () => {
                const gameId = this.playerSockets.get(socket.id);
                if (gameId) {
                    this.handlePlayerDisconnect(socket.id, gameId);
                }
                this.playerSockets.delete(socket.id);
            });
        });
    }

    drawTiles(letterBag, count) {
        const tiles = [];
        for (let i = 0; i < count && letterBag.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * letterBag.length);
            tiles.push(letterBag.splice(randomIndex, 1)[0]);
        }
        return tiles;
    }

    broadcastGamesList() {
        const availableGames = Array.from(this.gameRooms.entries())
            .filter(([_, game]) => game.status === 'waiting')
            .map(([id, game]) => ({
                id,
                hostName: game.players[0].name,
                playerCount: game.players.length
            }));
        this.io.emit('gamesList', availableGames);
    }

    handlePlayerDisconnect(playerId, gameId) {
        const game = this.gameRooms.get(gameId);
        if (game) {
            const playerIndex = game.players.findIndex(p => p.id === playerId);
            if (playerIndex !== -1) {
                game.players.splice(playerIndex, 1);
                
                if (game.players.length === 0) {
                    this.gameRooms.delete(gameId);
                } else {
                    if (game.currentTurn === playerId) {
                        const nextPlayerIndex = playerIndex % game.players.length;
                        game.currentTurn = game.players[nextPlayerIndex].id;
                    }
                    this.io.to(gameId).emit('gameUpdate', game);
                }
                this.broadcastGamesList();
            }
        }
    }
}

module.exports = SocketManager;
