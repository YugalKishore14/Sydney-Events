require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const fixIndexes = async () => {
    try {
        if (!process.env.MONGO_URI) {
            require('dotenv').config();
        }
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sydney_events');
        console.log('MongoDB Connected');

        const collection = mongoose.connection.collection('events');
        // List indexes
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes);

        try {
            await collection.dropIndex('externalId_1');
            console.log('Dropped externalId_1 index');
        } catch (e) {
            console.log('Index externalId_1 might not exist or failed to drop:', e.message);
        }

        console.log('Indexes fixed.');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.connection.close();
    }
};

fixIndexes();
