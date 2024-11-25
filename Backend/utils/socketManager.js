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
        
        this.connectedPlayers = new Map(); // Store player info
        this.initialize();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('playerJoined', ({ playerName }) => {
                // Add player to connected players
                this.connectedPlayers.set(playerName, {
                    socketId: socket.id,
                    online: true
                });

                // Broadcast updated player list
                this.broadcastPlayersList();

                // Announce new player
                this.io.emit('gameMessage', `${playerName} has joined!`);
            });

            socket.on('sendPing', ({ from, message }) => {
                this.io.emit('pingReceived', { from, message });
            });

            socket.on('playerLeft', ({ playerName }) => {
                this.connectedPlayers.delete(playerName);
                this.broadcastPlayersList();
                this.io.emit('gameMessage', `${playerName} has left.`);
            });

            socket.on('disconnect', () => {
                // Find and mark disconnected player
                for (const [playerName, data] of this.connectedPlayers.entries()) {
                    if (data.socketId === socket.id) {
                        this.connectedPlayers.set(playerName, {
                            ...data,
                            online: false
                        });
                        this.broadcastPlayersList();
                        break;
                    }
                }
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    broadcastPlayersList() {
        const playersList = {};
        this.connectedPlayers.forEach((data, playerName) => {
            playersList[playerName] = {
                online: data.online
            };
        });
        this.io.emit('playersList', playersList);
    }
}

module.exports = SocketManager;
