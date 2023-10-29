const User = require('../models/UserSchema')
const generateToken = require('../services/TokenService');
const verifyUserPassword = require('../services/PasswordUtils');

exports.login = (req,res,next) => {
    const {username, password} = req.body;

    //Logica para buscar el usuario en la base de datos
    User.findOne({username: username}, function(err,user) {
        if (err) {
            return next(err);
        }

        if(!user) {
            return res.status(401).json({message: 'Usuario no Encontrado'})
        }

        if (!verifyUserPassword(user, password)) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = generateToken(user.id);
        res.json({ token: token });
    })
}

exports.register = async (req,res) => {
    const {username, email, password} = req.body;

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear un nuevo usuario con la contraseña hasheada
    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        created_at: new Date(),
        followers: [],
        following: [],
        likes: []
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
