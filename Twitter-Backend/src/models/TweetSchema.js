const TweetSchema = new mongoose.Schema({
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: Date,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });
  