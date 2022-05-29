const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please provide a valid name']
    },
    age: {
        type: Number,
        required: true,
        default: 0,
        validate(value) {
            if (value < 0)
                throw new Error('Age must be a positive number...')
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('Please Enter a Valid Email ID')
        }
    },
    password: {
        type: String,
        minLength: 6,
        trim: true,
        required: true,
        validate(value) {
            if (value.toLowerCase().includes('password'))
                throw new Error("Password Can't have passwords");
        }
    }
});

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;