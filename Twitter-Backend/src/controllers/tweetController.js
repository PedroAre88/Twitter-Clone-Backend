const Tweet = require('../models/tweetSchema');

exports.getHomeTweets = async (req, res) => {
    const userId = req.user.id; 

    try {
        const user = await User.findById(userId);
        const followingIds = user.following.map(followingUser => followingUser._id);
        const tweets = await Tweet.find({ author: { $in: followingIds } })
                                  .populate('likes')
                                  .populate({
                                      path: 'comments',
                                      populate: {
                                        path: 'user',
                                        select: 'username'
                                      }
                                  })
                                  .sort({ created_at: -1 }) // Mostrar los tweets más recientes primero
                                  .lean();

        res.json(tweets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.createTweet = async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;

    const tweet = new Tweet({
        content: content,
        author: userId,
        created_at: new Date()
    });

    try {
        const savedTweet = await tweet.save();
        res.status(201).json(savedTweet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


exports.getTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id)
                                 .populate('likes')
                                 .populate('comments.author')
                                 .populate('comments.likes')
                                 .lean();
        res.json(tweet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.updateTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);

        if (tweet.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para actualizar este tweet' });
        }

        const updatedTweet = await Tweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTweet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.deleteTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);

        if (tweet.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este tweet' });
        }

        await Tweet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tweet eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.toggleLike = async (req, res) => {
    const tweetId = req.params.id;
    const userId = req.user.id;

    try {
        const tweet = await Tweet.findById(tweetId);

        // Verificar si el tweet existe
        if (!tweet) {
            return res.status(404).json({ message: 'Tweet no encontrado' });
        }

        // Verificar si el usuario ya le dio "like" al tweet
        if (tweet.likes.includes(userId)) {
            // Si el usuario ya le dio "like", quitar el "like"
            tweet.likes.pull(userId);
        } else {
            // Si el usuario no le dio "like", agregar el "like"
            tweet.likes.push(userId);
        }

        await tweet.save();

        res.json({ message: 'Like actualizado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


