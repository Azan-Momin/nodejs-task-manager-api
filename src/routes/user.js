const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Create a user / User Sign-up (keep the user logged in using a token)
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

// Read all users
/*
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users)
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
});
*/

// Fetch the user profile for logged-in user
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
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
        const user = await User.findById(req.params.id);

        updates.forEach((update) => {
            user[update] = req.body[update]
        });
        await user.save();

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

// User Login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

// User Logout (current session)
router.post('/users/logout', auth, async (req, res) => {
    try {
        // console.log('tokens: ', req.user.tokens);
        req.user.tokens = req.user.tokens.filter((tokenObj) => {
            // console.log('tokenObj', tokenObj);
            return tokenObj.token !== req.token;
        });
        await req.user.save();

        res.send('logged out the user from current session.');
    } catch (e) {
        res.status(500).send();
    }
});

// User Logout (all sessions)
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // console.log(req.user);
        req.user.tokens = [];
        // console.log(req.user.tokens);
        await req.user.save();
        res.status(200).send('Logged out user from all sessions...')
    } catch (e) {
        res.status(500).send()
    }
});

module.exports = router;