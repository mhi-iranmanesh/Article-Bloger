const mongoose = require('mongoose');
const schema = mongoose.Schema;

const comments = new schema({
    text: {
        type: String,
        required: true,
        min: 5
    },
    userId: {
        type: String,
        required: true,
    },
    articleId: {
        type: String,
        required: true,
        min: 10,
    },
    like: {
        type: Number,
        required: false,
    },
    disLike: {
        type: Number,
        required: false,
    },
    dateCreate: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('commentsArticle', comments);