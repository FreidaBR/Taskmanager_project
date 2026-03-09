import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { PriorityColorPipe, StatusColorPipe, CategoryIconPipe, DaysUntilPipe } from '../../pipes/task.pipes';
import { OverdueDirective } from '../../directives/overdue.directive';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatInputModule,
    MatSelectModule, MatFormFieldModule, MatDialogModule, MatSnackBarModule,
    MatProgressBarModule, MatChipsModule, MatTooltipModule,
    PriorityColorPipe, StatusColorPipe, CategoryIconPipe, DaysUntilPipe,
    OverdueDirective
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  allTasks: Task[] = [];
  filteredTasks: Task[] = [];
  showCompleted = false;

  searchQuery = '';
  filterCategory = 'All';
  filterPriority = 'All';
  sortBy = 'dueDate';
  viewMode: 'grid' | 'list' = 'grid';

  categories = ['All', 'Work', 'Personal', 'Health', 'Learning', 'Other'];
  priorities = ['All', 'low', 'medium', 'high'];

  completionRate = 0;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.taskService.tasks$.subscribe(tasks => {
      this.allTasks = tasks;
      this.applyFilters();
      const total = tasks.length;
      const done = tasks.filter(t => t.status === 'completed').length;
      this.completionRate = total ? Math.round((done / total) * 100) : 0;
    });
  }

  applyFilters() {
    let result = this.allTasks;
    if (this.showCompleted) result = result.filter(t => t.status === 'completed');
    else result = result.filter(t => t.status !== 'completed');

    if (this.filterCategory !== 'All') result = result.filter(t => t.category === this.filterCategory);
    if (this.filterPriority !== 'All') result = result.filter(t => t.priority === this.filterPriority);
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    this.filteredTasks = result.sort((a, b) => {
      if (this.sortBy === 'dueDate') return new Date(a.dueDate || '9999').getTime() - new Date(b.dueDate || '9999').getTime();
      if (this.sortBy === 'priority') { const o: any = { high: 0, medium: 1, low: 2 }; return o[a.priority] - o[b.priority]; }
      if (this.sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  isOverdue(task: Task): boolean {
    return !!task.dueDate && task.status !== 'completed' && new Date(task.dueDate) < new Date();
  }

  updateStatus(task: Task, status: 'pending' | 'in_progress' | 'completed') {
    this.taskService.updateStatus(task.id, status).subscribe(() => {
      this.snackBar.open(status === 'completed' ? '🎉 Task completed!' : 'Status updated', 'Close', { duration: 3000 });
    });
  }

  confirmDelete(task: Task) {
    const ref = this.dialog.open(DeleteConfirmDialogComponent, {
      data: { title: task.title },
      panelClass: 'dark-dialog'
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.taskService.deleteTask(task.id).subscribe(() => {
          this.snackBar.open('Task deleted', 'Close', { duration: 2000 });
        });
      }
    });
  }

  get activeCount() { return this.allTasks.filter(t => t.status !== 'completed').length; }
  get completedCount() { return this.allTasks.filter(t => t.status === 'completed').length; }
  get overdueCount() { return this.allTasks.filter(t => this.isOverdue(t)).length; }

  downloadTasksJson() {
    const dataStr = JSON.stringify(this.allTasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}