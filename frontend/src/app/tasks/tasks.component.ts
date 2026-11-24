import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';

/**
 * Composant principal : formulaire d'ajout + liste des tâches
 * avec modification, changement de statut et suppression.
 */
@Component({
  selector: 'app-tasks',
  imports: [ReactiveFormsModule],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);

  /** Liste des tâches (signal => l'affichage se met à jour automatiquement). */
  readonly tasks = signal<Task[]>([]);
  readonly error = signal<string | null>(null);

  /** Id de la tâche en cours de modification (null = aucune). */
  readonly editingId = signal<string | null>(null);

  /** Formulaire d'ajout. */
  readonly addForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });

  /** Formulaire de modification (en ligne). */
  readonly editForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  /** READ : charger toutes les tâches depuis l'API. */
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.error.set(null);
      },
      error: () => this.error.set("Impossible de joindre l'API. Le backend est-il démarré ?"),
    });
  }

  /** CREATE : ajouter une tâche. */
  addTask(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    this.taskService.addTask(this.addForm.getRawValue()).subscribe({
      next: (created) => {
        this.tasks.update((list) => [...list, created]);
        this.addForm.reset(); // remet les champs à vide
        this.error.set(null);
      },
      error: () => this.error.set("Erreur lors de l'ajout de la tâche."),
    });
  }

  /** UPDATE : marquer terminée / non terminée. */
  toggleCompleted(task: Task): void {
    this.taskService.updateTask(task._id!, { completed: !task.completed }).subscribe({
      next: (updated) => this.replaceTask(updated),
      error: () => this.error.set('Erreur lors de la mise à jour du statut.'),
    });
  }

  /** Passer en mode édition pour une tâche. */
  startEdit(task: Task): void {
    this.editingId.set(task._id!);
    this.editForm.setValue({ title: task.title, description: task.description ?? '' });
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  /** UPDATE : enregistrer le nouveau contenu de la tâche. */
  saveEdit(task: Task): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.taskService.updateTask(task._id!, this.editForm.getRawValue()).subscribe({
      next: (updated) => {
        this.replaceTask(updated);
        this.editingId.set(null);
      },
      error: () => this.error.set('Erreur lors de la modification de la tâche.'),
    });
  }

  /** DELETE : supprimer une tâche après confirmation. */
  deleteTask(task: Task): void {
    if (!confirm(`Supprimer la tâche « ${task.title} » ?`)) return;
    this.taskService.deleteTask(task._id!).subscribe({
      next: () => this.tasks.update((list) => list.filter((t) => t._id !== task._id)),
      error: () => this.error.set('Erreur lors de la suppression.'),
    });
  }

  /** Remplace une tâche dans la liste locale par sa version mise à jour. */
  private replaceTask(updated: Task): void {
    this.tasks.update((list) => list.map((t) => (t._id === updated._id ? updated : t)));
  }
}
