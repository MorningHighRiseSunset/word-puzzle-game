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
        
        this.players = new Map(); // Store player info
        this.initialize();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('playerJoined', ({ playerName }) => {
                // Store player info
                this.players.set(playerName, {
                    socketId: socket.id,
                    online: true
                });

                // Broadcast updated player list
                this.broadcastPlayersList();
                
                // Broadcast join action
                this.io.emit('playerAction', {
                    player: playerName,
                    action: 'joined the room 🎉'
                });
            });

            socket.on('playerAction', ({ player, action, buttonId }) => {
                // Broadcast the action to all clients
                this.io.emit('playerAction', {
                    player,
                    action,
                    buttonId
                });
            });

            socket.on('playerLeft', ({ playerName }) => {
                this.players.delete(playerName);
                this.broadcastPlayersList();
                this.io.emit('playerAction', {
                    player: playerName,
                    action: 'left the room 👋'
                });
            });

            socket.on('disconnect', () => {
                // Find and mark disconnected player
                for (const [playerName, data] of this.players.entries()) {
                    if (data.socketId === socket.id) {
                        this.players.set(playerName, {
                            ...data,
                            online: false
                        });
                        this.broadcastPlayersList();
                        this.io.emit('playerAction', {
                            player: playerName,
                            action: 'went offline 🔴'
                        });
                        break;
                    }
                }
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    broadcastPlayersList() {
        const playersList = {};
        this.players.forEach((data, playerName) => {
            playersList[playerName] = {
                online: data.online
            };
        });
        this.io.emit('playersList', playersList);
    }
}

module.exports = SocketManager;
