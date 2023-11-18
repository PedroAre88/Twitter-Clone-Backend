const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://cesarcayaffa0:admin123@cluster0.xhaajgp.mongodb.net/myapp?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error al conectar a MongoDB', err);
    process.exit(1);
  }
};

module.exports = connectDB;
