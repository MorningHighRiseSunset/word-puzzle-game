import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.gameId = null;
        // Use the Render backend URL
        this.API_URL = process.env.REACT_APP_BACKEND_URL || 'https://word-puzzle-backend.onrender.com';
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
                console.log('Connected to game server:', this.API_URL);
            });

            this.socket.on('connect_error', (error) => {
                console.error('Connection error:', error);
            });
        }
        return this.socket;
    }
}

export default new SocketService();
