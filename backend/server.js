require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
app.use(express.json()); // lecture du JSON dans req.body

// --- Routes ---
app.get('/', (req, res) => res.json({ message: 'API To-Do List opérationnelle' }));
app.use('/tasks', taskRoutes);

// --- Route inconnue ---
app.use((req, res) => res.status(404).json({ message: 'Route introuvable' }));

// --- Démarrage : on se connecte à MongoDB puis on écoute ---
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
});
