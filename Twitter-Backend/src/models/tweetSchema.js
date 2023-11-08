const mongoose = require('mongoose')

const TweetSchema = new mongoose.Schema({
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: Date,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        content: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        created_at: Date
    }]
});

module.exports = mongoose.model('Tweet', TweetSchema);


  