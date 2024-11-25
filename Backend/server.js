const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

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

// Basic route to test server
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Initialize socket.io
const socketManager = new SocketManager(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = server;
