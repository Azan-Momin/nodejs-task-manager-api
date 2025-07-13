const express = require('express');
const connectDB = require('./db/mongoose.js');
const TaskRouter = require('./routes/task');
const UserRouter = require('./routes/user')

// Run the Server
const app = express();

// Connect to the database
connectDB();

// Middlewares
app.use(express.json());
// Routers
app.use(TaskRouter);
app.use(UserRouter);

// Homepage
app.get('/', (req, res) => {
    res.status(200).send('Homepage...');
});

// Listen on Port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server started on: http://localhost:' + PORT);
});