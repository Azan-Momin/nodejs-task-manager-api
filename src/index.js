const express = require('express');
const connectDB = require('./db/mongoose.js');
// require('./db/mongoose.js');
const TaskRouter = require('./routes/task');

// Run the Server
const app = express();

// Connect to the database
connectDB();

// app.use(express.json());
// Routers
app.use(TaskRouter);

// Homepage
app.get('/', (req, res) => {
    res.status(200).send('Homepage...');
});

// Listen on Port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server started on: http://localhost:' + PORT);
});