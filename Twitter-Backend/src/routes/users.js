const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { login, register, profile } = require('../controllers/userController');

router.post('/login', login);
router.post('/register', register);
router.get('/profile', auth, profile);

module.exports = router;