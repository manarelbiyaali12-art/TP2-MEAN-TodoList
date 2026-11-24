import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

/**
 * Service qui consomme l'API REST du backend (CRUD).
 * Le backend doit tourner sur http://localhost:3000
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/tasks';

  /** GET /tasks */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /** POST /tasks */
  addTask(task: Pick<Task, 'title' | 'description'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  /** PUT /tasks/:id */
  updateTask(id: string, changes: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, changes);
  }

  /** DELETE /tasks/:id */
  deleteTask(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
