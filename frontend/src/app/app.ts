import { Component } from '@angular/core';
import { TasksComponent } from './tasks/tasks.component';

/** Composant racine : affiche simplement le composant de gestion des tâches. */
@Component({
  selector: 'app-root',
  imports: [TasksComponent],
  template: '<app-tasks />',
})
export class App {}
