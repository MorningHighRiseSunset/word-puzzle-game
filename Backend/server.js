const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const gameRoutes = require('./routes/gameRoutes');
const SocketManager = require('./utils/socketManager');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
    origin: "https://word-puzzle-frontend.onrender.com",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/game', gameRoutes);

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Initialize socket.io
const socketManager = new SocketManager(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = server;
