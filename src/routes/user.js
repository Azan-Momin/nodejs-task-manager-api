const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Create a user
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
});

// Read all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users)
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
});

// Read a user with ID
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
});

// Update a user
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body),
    allowedUpdates = ['name', 'email', 'password', 'age'],
    isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid update!'});
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if(!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
});

module.exports = router;