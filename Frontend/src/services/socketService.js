import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.gameId = null;
        this.API_URL = 'https://word-puzzle-backend.onrender.com';
    }

    connect() {
        if (!this.socket) {
            this.socket = io(this.API_URL, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5
            });

            this.socket.on('connect', () => {
                console.log('Connected to game server');
            });

            this.socket.on('connect_error', (error) => {
                console.error('Connection error:', error);
            });
        }
        return this.socket;
    }

    emit(eventName, data) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        } else {
            console.error('Socket not connected');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    createGame(playerName) {
        this.emit('createGame', { playerName });
    }

    joinGame(gameId, playerName) {
        this.emit('joinGame', { gameId, playerName });
    }

    placeTile(gameId, playerName, position, letter) {
        this.emit('placeTile', { gameId, playerName, position, letter });
    }

    endTurn(gameId, playerName) {
        this.emit('endTurn', { gameId, playerName });
    }

    getGames() {
        this.emit('getGames');
    }
}

export default new SocketService();
