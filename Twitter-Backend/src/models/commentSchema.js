const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: Date,
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Comment', CommentSchema);