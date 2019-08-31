const mongoose = require('mongoose');
const schema = mongoose.Schema;

const articleSchema = new schema({
    userName: {
        type: String,
        required: true,
        min: 4,
        max: 25
    },
    title: {
        type: String,
        required: true,
        trim: true,
        min: 2
    },
    text: {
        type: String,
        required: true,
        min: 10,
    },
    picPath: {
        type: String,
        required: true,
    },
    dateCreate: {
        type: Date,
        default: Date.now,
    },
    lastUpdate: {
        type: Date,
        default: Date.now,
        require: true
    },
    visit: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('article', articleSchema);