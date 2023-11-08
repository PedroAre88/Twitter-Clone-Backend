const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }
});

module.exports = mongoose.model('Like', LikeSchema);
