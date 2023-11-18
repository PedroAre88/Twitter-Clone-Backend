const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController');

// Proteger todas las rutas con autenticación
const auth = require('../middlewares/auth');
router.use(auth);

// Ruta para obtener los tweets de los usuarios seguidos
router.get('/home', tweetController.getHomeTweets);

// Ruta para crear un nuevo tweet
router.post('/tweets/', tweetController.createTweet);

// Ruta para obtener un tweet específico
router.get('/:id', tweetController.getTweet);

// Ruta para actualizar un tweet
router.put('/:id', tweetController.updateTweet);

// Ruta para borrar un tweet
router.delete('/:id', tweetController.deleteTweet);

// Ruta para dar like a un tweet y en caso de que lo tenga quitarselo
router.post('/tweets/:id/like', tweetController.toggleLike);

module.exports = router;
