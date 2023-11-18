const User = require('../models/userSchema')
const generateToken = require('../services/tokenService');
const verifyUserPassword = require('../services/passwordUtils');
const Tweet = require('../models/tweetSchema');
const tokens = {};

exports.login = (req,res,next) => {
    const {username, password} = req.body;
 
    // Logica para buscar el usuario en la base de datos
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
 
        // Almacenar el token en la caché
        tokens[user.id] = token;
 
        res.json({ token: token });
 
        // Redirigir al usuario a la ruta /home
        res.redirect(302, '/home');
    })
}


exports.logout = (req, res) => {
    // Eliminar el token de la caché
    delete tokens[req.user.id];
  
    // Redirigir al usuario a la página de inicio de sesión
    res.redirect('/login');
}
 

exports.register = async (req,res) => {
    const {username, email, password, bio} = req.body;

    try {
        // Verificar si el correo electrónico ya está en uso
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
        }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear un nuevo usuario con la contraseña hasheada
    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        bio: bio,
        created_at: new Date(),
        followers: [],
        following: [],
        likes: []
    });

    const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


exports.profile = async (req, res) => {
    const userId = req.user.id; 
    const { sort, order } = req.query; // Obtener los parámetros de ordenación de la query

    try {
        const user = await User.findById(userId).select('-password'); // Excluir la contraseña

        // Crear la consulta de ordenación
        let sortQuery = {};
        if (sort === 'date') {
            sortQuery.created_at = order === 'asc' ? 1 : -1;
        } else if (sort === 'likes') {
            sortQuery.likes = order === 'asc' ? 1 : -1;
        }

        const tweets = await Tweet.find({ author: userId })
                                   .sort(sortQuery) // Aplicar la ordenación
                                   .populate('likes')
                                   .populate({
                                       path: 'comments',
                                       populate: {
                                         path: 'user',
                                         select: 'username'
                                       }
                                   })
                                   .lean();
        const followersCount = user.followers.length;
        const followingCount = user.following.length;

        res.json({
            user: user,
            tweets: tweets,
            followersCount: followersCount,
            followingCount: followingCount
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


exports.toggleFollow = async (req, res) => {
    const userId = req.user.id;
    const followId = req.params.id;

    try {
        const user = await User.findById(userId);
        const followUser = await User.findById(followId);

        // Verificar si el usuario ya está siguiendo al otro usuario
        if (user.following.includes(followId)) {
            // Si el usuario ya está siguiendo al otro, dejar de seguir
            user.following.pull(followId);
            followUser.followers.pull(userId);
        } else {
            // Si el usuario no está siguiendo al otro, seguir
            user.following.push(followId);
            followUser.followers.push(userId);
        }

        await user.save();
        await followUser.save();

        res.json({ message: 'Seguidos y seguidores actualizados' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.searchUsers = async (req, res) => {
    const searchTerm = req.query.q;

    try {
        const users = await User.find({
            username: { $regex: searchTerm, $options: 'i' } // 'i' significa case-insensitive
        });

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}