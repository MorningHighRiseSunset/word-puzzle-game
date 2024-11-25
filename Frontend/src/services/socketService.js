import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.gameId = null;
    }

    connect() {
        this.socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001');
        
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return this.socket;
    }

    joinGame(gameId, userId) {
        if (this.socket) {
            this.gameId = gameId;
            this.socket.emit('joinGame', gameId, userId);
        }
    }

    placeTile(position, letter, userId) {
        if (this.socket && this.gameId) {
            this.socket.emit('placeTile', {
                gameId: this.gameId,
                position,
                letter,
                userId
            });
        }
    }

    submitWord(word, positions, userId) {
        if (this.socket && this.gameId) {
            this.socket.emit('submitWord', {
                gameId: this.gameId,
                word,
                positions,
                userId
            });
        }
    }

    endTurn(userId) {
        if (this.socket && this.gameId) {
            this.socket.emit('endTurn', {
                gameId: this.gameId,
                userId
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.gameId = null;
        }
    }
}

export default new SocketService();
