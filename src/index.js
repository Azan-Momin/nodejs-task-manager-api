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



// ---------------------------------------------------- Testing Code (Playground) --------------------------------------------------------------------
/* 
// Task: Generate a JSON Web Token and verify the same
const jwt = require('jsonwebtoken');

const generateToken = async () => {
    const token = jwt.sign({_id: 'abcde12345'}, 'mySecretKey', {expiresIn: '7 days'});  // Creates a hashed token
    console.log(token);

    const data = jwt.verify(token, 'mySecretKey');
    console.log(data);
}

generateToken();
*/

/*
// Task: 
// Approach#1: Manually converting an object to a JSON string
const pet = {
    name: 'Tom'
}
console.log(JSON.stringify(pet));

// Approach#2: Using the toJSON user-defined function approach to return data
const myPet = {
    name: 'Tom'
}

myPet.toJSON = function () {
    console.log(this);
    return this; // Whatever you return here will show up in the JSON.stringify() function for the current object
}

myPet.toJSON();
*/

// Task: Get a value (owner id) from a record (task)
/*
const Task = require('./models/task');

const main = async () => {
    const task = await Task.findById('697e511e70b0443f2e253922')
    // console.log(task);
    // await task.populate('owner').execPopulate();
    // await task.populate('owner').exec();
    console.log(task.owner);    // gives - new ObjectId('697e510170b0443f2e25391a') instead of just '697e510170b0443f2e25391a' ???
    await task.populate('owner');
    console.log(task.owner);    // After populating, it gives you the entire user record, instead of just the owner id
}

main();
*/

// Task: Get values (tasks) from a record (user)
/*
const User = require('./models/user.js');

const main = async () => {
    const user = await User.findById('697e510170b0443f2e25391a')
    // await user.populate('tasks').execPopulate();
    // await user.populate('tasks').exec();
    // console.log(user.tasks);    // undefined before the tasks are populated
    await user.populate('tasks');
    console.log(user.tasks);
}

main();
*/