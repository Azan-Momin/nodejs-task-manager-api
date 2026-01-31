const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

// Create a task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    console.log('task')
    console.log(task)

    try {
        await task.save(task);
        res.status(201).send(task);
    } catch (e) {
        console.log(e);
        return res.status(400).send(e);
    }
    
})

// Read all available tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).send(e);
    }
});

// Read a task based on its Object_id
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);

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

// Delete a task
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

module.exports = router;