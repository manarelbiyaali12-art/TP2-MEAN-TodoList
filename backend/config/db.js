const mongoose = require('mongoose');

/**
 * Connexion à MongoDB via Mongoose.
 * L'URI est lue dans le fichier .env (variable MONGODB_URI).
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todolist';
  try {
    await mongoose.connect(uri);
    console.log('Connecté à MongoDB :', uri);
  } catch (err) {
    console.error('Erreur de connexion à MongoDB :', err.message);
    process.exit(1); // on arrête le serveur si la base est inaccessible
  }
}

module.exports = connectDB;
