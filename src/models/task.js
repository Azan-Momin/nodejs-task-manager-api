const mongoose = require('mongoose');

// Defining a Schema
const TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// Creating a Model
const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;