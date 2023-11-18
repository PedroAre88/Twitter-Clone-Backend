const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Ruta para crear un comentario
router.post('/tweets/:tweetId', commentController.createComment);

// Ruta para darle like a un comentario y en caso de tenerlo quitarselo
router.post('/:id/like', commentController.toggleLike);

// Ruta para obtener el comentario de ese tweet
router.get('/tweets/:id/comments', commentController.getCommentsByTweet);

// Ruta para actualizar un comentario
router.put('/:id', commentController.updateComment);

// Ruta para eliminar un comentario
router.delete('/:id', commentController.deleteComment);



module.exports = router;