const mongoose = require('mongoose');
require('dotenv').config();

const testDatabase = async () => {
    try {
        // Try to connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/scrabble');
        console.log('✅ Connected to MongoDB successfully!');

        // Create a simple test entry
        const Test = mongoose.model('Test', new mongoose.Schema({ name: String }));
        await Test.create({ name: 'test connection' });
        console.log('✅ Successfully created test document');

        // Find the test entry
        const found = await Test.findOne({ name: 'test connection' });
        console.log('✅ Successfully found test document:', found);

        // Clean up - delete test entry
        await Test.deleteMany({});
        console.log('✅ Cleaned up test data');

        // Close connection
        await mongoose.connection.close();
        console.log('✅ Database connection closed');

    } catch (error) {
        console.error('❌ Database test failed:', error);
    }
};

testDatabase();
