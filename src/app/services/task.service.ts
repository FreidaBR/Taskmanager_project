import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Task, Priority, Status, Category } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageKey = 'tasks_angular_v1';
  private syncUrl = 'http://localhost:3000/tasks-sync';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initTasks();
  }

  private initTasks(): void {
    // Try to load from JSON file on server first
    this.http.get<Task[]>('http://localhost:3000/tasks-json').subscribe({
      next: (tasks) => {
        if (Array.isArray(tasks) && tasks.length > 0) {
          this.tasksSubject.next(tasks);
          this.saveLocal(tasks);
        } else {
          const local = this.loadFromLocal();
          this.tasksSubject.next(local);
        }
      },
      error: () => {
        const local = this.loadFromLocal();
        this.tasksSubject.next(local);
      }
    });
  }

  private loadFromLocal(): Task[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : this.getSeedData();
    } catch {
      return this.getSeedData();
    }
  }

  private saveToStorage(tasks: Task[]): void {
    this.saveLocal(tasks);
    this.syncToFile(tasks);
  }

  private saveLocal(tasks: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  private syncToFile(tasks: Task[]): void {
    this.http.post(this.syncUrl, tasks).subscribe({
      next: () => {},
      error: () => {
        // fail silently if file sync is not available
      }
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  getAllTasks(): Observable<Task[]> {
    return this.tasks$.pipe(delay(100));
  }

  getTaskById(id: string): Observable<Task | undefined> {
    return this.tasks$.pipe(map(tasks => tasks.find(t => t.id === id)));
  }

  addTask(data: Partial<Task>): Observable<Task> {
    const newTask: Task = {
      id: this.generateId(),
      title: data.title || '',
      description: data.description || '',
      category: data.category || 'Other',
      priority: data.priority || 'medium',
      status: data.status || 'pending',
      dueDate: data.dueDate || '',
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newTask, ...this.tasksSubject.value];
    this.tasksSubject.next(updated);
    this.saveToStorage(updated);
    return of(newTask);
  }

  updateTask(updated: Task): Observable<Task> {
    const tasks = this.tasksSubject.value.map(t =>
      t.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : t
    );
    this.tasksSubject.next(tasks);
    this.saveToStorage(tasks);
    return of(updated);
  }

  deleteTask(id: string): Observable<void> {
    const tasks = this.tasksSubject.value.filter(t => t.id !== id);
    this.tasksSubject.next(tasks);
    this.saveToStorage(tasks);
    return of(void 0);
  }

  updateStatus(id: string, status: Status): Observable<void> {
    const tasks = this.tasksSubject.value.map(t =>
      t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
    );
    this.tasksSubject.next(tasks);
    this.saveToStorage(tasks);
    return of(void 0);
  }

  private getSeedData(): Task[] {
    return [
      { id: 's1', title: 'Design system architecture', category: 'Work', priority: 'high', status: 'in_progress', dueDate: '2026-03-05', description: 'Plan microservices layout for Q2 launch', tags: ['architecture', 'planning'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 's2', title: 'Review quarterly KPIs', category: 'Work', priority: 'medium', status: 'pending', dueDate: '2026-03-10', description: 'Analyze team performance metrics', tags: ['metrics'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 's3', title: 'Morning run 5km', category: 'Health', priority: 'low', status: 'completed', dueDate: '2026-02-28', description: 'Maintain fitness routine', tags: ['fitness'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 's4', title: 'Read Clean Architecture', category: 'Learning', priority: 'medium', status: 'pending', dueDate: '2026-03-15', description: 'Chapters 10–15', tags: ['books', 'dev'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 's5', title: 'Fix production bug #2847', category: 'Work', priority: 'high', status: 'pending', dueDate: '2026-03-01', description: 'Auth token refresh loop', tags: ['bug', 'urgent'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
  }
}