// auth.js
// Authenticate a user using a JSON web token
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    // console.log('In auth middleware...');
    // next();
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'mySecretKey');   // returns an object with user-id and iat
        //console.log(token);
        //console.log(decoded);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});

        if (!user) {
            throw new Error();
        }

        req.token = token; // contains the token for the current user session
        req.user = user;    // Assign user to the request object as it will be used in further operations
        next();
    } catch (e) {
        res.status(401).send({error: 'Please authenticate...'})
    }
}

module.exports = auth;