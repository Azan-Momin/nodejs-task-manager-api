const mongoose = require('mongoose');

const db = 'task-manager-api';
const URI = 'mongodb://127.0.0.1:27017/' + db;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(URI);
        console.log('Database connection established on: ' + conn.connection.host);
    } catch (e) {
        console.log('Error: ' + e);
        // return false;
        process.exit(1);
    }
};

module.exports = connectDB;