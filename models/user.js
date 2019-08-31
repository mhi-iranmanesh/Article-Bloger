const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 1,
        max: 15
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 1,
        max: 20
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 8,
        max: 40
    },
    gender: {
        type: String,
        required: true,
        enum: ['woman', 'male'],
        min: 4,
        max: 5
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        min: 10,
        max: 15
    },
    dateCreate: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        require: true,
        enum: ['admin', 'user']
    }
});

module.exports = mongoose.model('user', UserSchema);