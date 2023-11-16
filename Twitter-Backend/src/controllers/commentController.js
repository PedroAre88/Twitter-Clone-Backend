const Comment = require('../models/commentSchema');

exports.createComment = async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;
    const tweetId = req.params.tweetId;  // Obtener el ID del tweet de la URL de la solicitud

    const comment = new Comment({
        content: content,
        author: userId,
        tweet: tweetId,  // Establecer el campo 'tweet' del comentario con el ID del tweet
        created_at: new Date()
    });

    try {
        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


exports.getCommentsByTweet = async (req, res) => {
    const tweetId = req.params.id;

    try {
        const comments = await Comment.find({ tweet: tweetId })
                                      .populate('likes')
                                      .lean();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para actualizar este comentario' });
        }

        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comentario eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.toggleLike = async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;

    try {
        const comment = await Comment.findById(commentId);

        // Verificar si el comentario existe
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        // Verificar si el usuario ya le dio "like" al comentario
        if (comment.likes.includes(userId)) {
            // Si el usuario ya le dio "like", quitar el "like"
            comment.likes.pull(userId);
        } else {
            // Si el usuario no le dio "like", agregar el "like"
            comment.likes.push(userId);
        }

        await comment.save();

        res.json({ message: 'Like actualizado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

