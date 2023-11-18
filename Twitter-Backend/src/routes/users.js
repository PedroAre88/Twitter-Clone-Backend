const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { login, register, profile, toggleFollow, logout, searchUsers } = require('../controllers/userController');

// Ruta para hacer login y verificar el usuario
router.post('/login', login);

// Ruta de cierre de sesión
router.post('/logout', logout);

// Ruta para registrar un usuario
router.post('/register', register);

// Ruta para acceder al perfil y autenticar su sesion
router.get('/profile', auth, profile);

// Ruta para seguir y dejar de seguir a un usuario y añadirlo a la lista de seguidos
router.post('/:id/follow', toggleFollow);

// Ruta para la busqueda y filtracion de usuarios
router.get('/search', searchUsers);

module.exports = router;