const express = require('express');
const connectDB = require('./services/db');
const userRouter = require('./routes/users');
const tweetRouter = require('./routes/tweets');
const commentRouter = require('./routes/comments');
const passport = require('./services/userVerify');

app.use(passport.initialize());

const app = express();

// Conectar a la base de datos
connectDB();

// Configurar Express para usar JSON
app.use(express.json());

// Configurar las rutas
app.use('/users', userRouter);
app.use('/tweets', tweetRouter);
app.use('/comments', commentRouter); // Asegúrate de que Express use las rutas de los comentarios

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
