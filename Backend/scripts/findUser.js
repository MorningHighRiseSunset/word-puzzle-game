const mongoose = require('mongoose');
require('dotenv').config();

async function findUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/scrabble');
        console.log('Connected to MongoDB');

        // Get the users collection
        const users = await mongoose.connection.collection('users').find({}).toArray();
        
        // Print users in a readable format
        console.log('\nUsers in database:');
        users.forEach(user => {
            console.log('\nUser Details:');
            console.log('Username:', user.username);
            console.log('Email:', user.email);
            console.log('ID:', user._id);
            console.log('------------------------');
        });

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');

    } catch (error) {
        console.error('Error:', error);
    }
}

findUsers();
