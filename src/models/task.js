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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,        
        ref: 'User' // Should always be inside quotes
    }
}/*, {
    toJSON: {virtuals: true}
}*/);

// Creating a Model
const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;