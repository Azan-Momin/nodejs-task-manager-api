const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw new Error ('Invalid email id.');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate (value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error ('Password cannot contain the text password.')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate (value) {
            if (value < 0) {
                throw new Error ('Age should be a positive number.');
            }
        }
    }
});

module.exports = User;