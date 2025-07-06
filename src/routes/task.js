const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/task');
const router = new express.Router();

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).send(e);
    }
});

module.exports = router;