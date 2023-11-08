const User = require('../models/userSchema')
const generateToken = require('../services/tokenService');
const verifyUserPassword = require('../services/passwordUtils');
const Tweet = require('../models/TweetSchema');

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

