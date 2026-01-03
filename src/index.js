const express = require('express');
const connectDB = require('./db/mongoose.js');
const TaskRouter = require('./routes/task');
const UserRouter = require('./routes/user');

// Run the Server
const app = express();

// Connect to the database
connectDB();

// ---------------------------------------------------------- Middlewares --------------------------------------------------------
// Disable GET requests
/*
app.use((req, res, next) => {
    //console.log('Request method used was: ', req.method);
    if (req.method === 'GET') {
        res.send('GET requests are disabled...');
    } else {
        next();
    }
});
*/

// Enable maintanance mode
/*
app.use((req, res, next) => {
    res.status(503).send('Server down for maintenance, please come back later...');
    //next(); // Do not call next because we don't want to proceed further with the execution
});
*/

app.use(express.json());

// Routers
app.use(TaskRouter);
app.use(UserRouter);


// Routes
// Homepage
app.get('/', (req, res) => {
    res.status(200).send('You are now on Homepage...');
});

// Listen on Port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server started on: http://localhost:' + PORT);
});