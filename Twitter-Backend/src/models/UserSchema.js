const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    created_at: Date,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }]
  });


module.exports = mongoose.model('User', UserSchema);