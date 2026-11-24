const mongoose = require('mongoose');
const Task = require('../models/Task');

/** Ne garde que les champs autorisés (évite d'écraser _id, createdAt...). */
function pickFields(body) {
  const data = {};
  for (const key of ['title', 'description', 'completed']) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  return data;
}

/** Gestion d'erreur commune : validation Mongoose -> 400, sinon 500. */
function handleError(res, err) {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ message });
  }
  console.error(err);
  return res.status(500).json({ message: 'Erreur interne du serveur' });
}

/** GET /tasks – récupérer toutes les tâches (plus anciennes en premier). */
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    handleError(res, err);
  }
};

/** POST /tasks – ajouter une nouvelle tâche. */
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(pickFields(req.body));
    res.status(201).json(task);
  } catch (err) {
    handleError(res, err);
  }
};

/** PUT /tasks/:id – mettre à jour une tâche (titre, description, statut). */
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Identifiant invalide' });
  }
  try {
    const task = await Task.findByIdAndUpdate(id, pickFields(req.body), {
      new: true,           // renvoie le document modifié
      runValidators: true, // applique les validations du schéma
    });
    if (!task) return res.status(404).json({ message: 'Tâche introuvable' });
    res.json(task);
  } catch (err) {
    handleError(res, err);
  }
};

/** DELETE /tasks/:id – supprimer une tâche. */
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Identifiant invalide' });
  }
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: 'Tâche introuvable' });
    res.json({ message: 'Tâche supprimée', id });
  } catch (err) {
    handleError(res, err);
  }
};
