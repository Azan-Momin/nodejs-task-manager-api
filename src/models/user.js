const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Foreign (virtual) field
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

// Middleware to hash the password before saving it
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Create an auth token for user
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'mySecretKey');
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

// Get User's Public Profile - hide trivial and critical information
// userSchema.methods.getPublicProfile = function (req, res) {
userSchema.methods.toJSON = function() {
    const user = this;
    const userObj = user.toObject();    // If user is already an object, then why are we converting it to object again
    
    // Remove details from user object
    delete userObj.password;
    delete userObj.tokens;
    return userObj;
}

// Find by Credentials
// For this to work, ensure that the stored password is already hashed *
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    
    if (!user) {
        throw new Error ('Unable to login user');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error ('Unable to login pass');
    }

    return user;
}

const User = mongoose.model('User', userSchema);

module.exports = User;