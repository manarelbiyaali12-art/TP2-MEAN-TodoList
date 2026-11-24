const mongoose = require('mongoose');

/**
 * Modèle d'une tâche.
 *  - title       : titre de la tâche (obligatoire)
 *  - description : détail facultatif (visible sur la maquette du TP)
 *  - completed   : statut (booléen, false par défaut)
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      trim: true,
      minlength: [2, 'Le titre doit contenir au moins 2 caractères'],
      maxlength: [120, 'Le titre ne doit pas dépasser 120 caractères'],
    },
    description: { type: String, trim: true, default: '' },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true } // ajoute createdAt et updatedAt automatiquement
);

module.exports = mongoose.model('Task', taskSchema);
