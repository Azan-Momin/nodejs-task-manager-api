const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

// Create a task (login required)
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save(task);
        res.status(201).send(task);
    } catch (e) {
        console.log(e);
        return res.status(400).send(e);
    }
    
})

// Read all available tasks (from all users)
/*
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).send(e);
    }
});
*/

// Read all tasks created by the current user
router.get('/tasks', auth, async (req, res) => {
    try {
        // Find tasks based on owner id of the tasks
        // const tasks = await Task.find({owner: req.user._id});
        // res.send(tasks);

        // Find the tasks 
        const tasks = await req.user.populate('tasks');
        res.send(req.user.tasks);        
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).send(e);
    }
});

// Get a task by Id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({_id, owner: req.user._id});

        if (!task) {
            return res.status(404).send()
        }

        res.send(task);
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).send();
    }
});

// Update a task
/*
router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id,
    task = req.body,
    allowedUpdates = ['description', 'completed'],
    updates = Object.keys(req.body),    
    isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'});
    }

    try {
        const updatedTask = await Task.findById(_id);
        
        updates.forEach(update => updatedTask[update] = req.body[update]);
        await updatedTask.save();

        if (!updatedTask) {
            return res.status(404).send({error: 'Document not found!'});
        }
        return res.send(updatedTask);
    } catch (e) {
        console.log(e);
        return res.status(400).send(e);
    }
});
*/

// Update a task (for a logged-in user)
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id,
    task = req.body,
    allowedUpdates = ['description', 'completed'],
    updates = Object.keys(req.body),    
    isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'});
    }

    try {
        const updatedTask = await Task.findOne({_id, owner: req.user._id});

        // Null check
        if (!updatedTask) {
            return res.status(404).send({error: 'Document not found!'});
        }

        updates.forEach(update => updatedTask[update] = req.body[update]);
        await updatedTask.save();
        
        return res.send(updatedTask);
    } catch (e) {
        console.log(e);
        return res.status(400).send(e);
    }
});

// Delete a task
/*
router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findByIdAndDelete(_id);

        if (!task) {
            return res.status(404).send({error: 'Document not found!'})
        }
        res.send(task);
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }
});
*/

// Delete task for a logged-in user (based on ID)
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id});

        if (!task) {
            return res.status(404).send({error: 'Document not found!'})
        }
        res.send(task);
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }
});


module.exports = router;