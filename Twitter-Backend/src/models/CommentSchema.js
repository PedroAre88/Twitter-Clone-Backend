const CommentSchema = new mongoose.Schema({
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
    created_at: Date
  });
  