/** Représentation d'une tâche côté frontend (reflète le modèle MongoDB). */
export interface Task {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}
