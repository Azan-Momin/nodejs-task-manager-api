const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/task');
const router = new express.Router();

// Read all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).send(e);
    }
});

// Read a task
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

module.exports = router;