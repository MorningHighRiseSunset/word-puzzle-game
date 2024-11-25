const socketIO = require('socket.io');

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
        this.initialize();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('createGame', ({ playerName }) => {
                const gameId = Math.random().toString(36).substring(7);
                this.gameRooms.set(gameId, {
                    players: [{ id: socket.id, name: playerName }],
                    board: Array(15).fill().map(() => Array(15).fill(null)),
                    currentTurn: playerName,
                    status: 'waiting'
                });
                socket.join(gameId);
                socket.emit('gameUpdate', this.gameRooms.get(gameId));
                this.broadcastGamesList();
            });

            socket.on('joinGame', ({ gameId, playerName }) => {
                const game = this.gameRooms.get(gameId);
                if (game && game.players.length < 4) {
                    game.players.push({ id: socket.id, name: playerName });
                    socket.join(gameId);
                    this.io.to(gameId).emit('gameUpdate', game);
                    if (game.players.length === 2) {
                        game.status = 'active';
                    }
                    this.broadcastGamesList();
                }
            });

            socket.on('placeTile', ({ gameId, playerName, position, letter }) => {
                const game = this.gameRooms.get(gameId);
                if (game && game.currentTurn === playerName) {
                    const { row, col } = position;
                    if (!game.board[row][col]) {
                        game.board[row][col] = letter;
                        this.io.to(gameId).emit('gameUpdate', game);
                    }
                }
            });

            socket.on('endTurn', ({ gameId, playerName }) => {
                const game = this.gameRooms.get(gameId);
                if (game && game.currentTurn === playerName) {
                    const currentPlayerIndex = game.players.findIndex(p => p.name === playerName);
                    const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
                    game.currentTurn = game.players[nextPlayerIndex].name;
                    this.io.to(gameId).emit('gameUpdate', game);
                }
            });

            socket.on('getGames', () => {
                this.broadcastGamesList();
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
                this.handleDisconnect(socket.id);
            });
        });
    }

    broadcastGamesList() {
        const availableGames = Array.from(this.gameRooms.entries())
            .filter(([_, game]) => game.status === 'waiting')
            .map(([id, game]) => ({
                id,
                players: game.players.map(p => p.name)
            }));
        this.io.emit('gamesList', availableGames);
    }

    handleDisconnect(socketId) {
        for (const [gameId, game] of this.gameRooms.entries()) {
            const playerIndex = game.players.findIndex(p => p.id === socketId);
            if (playerIndex !== -1) {
                game.players.splice(playerIndex, 1);
                if (game.players.length === 0) {
                    this.gameRooms.delete(gameId);
                } else {
                    this.io.to(gameId).emit('gameUpdate', game);
                }
                this.broadcastGamesList();
                break;
            }
        }
    }
}

module.exports = SocketManager;
