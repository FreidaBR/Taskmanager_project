import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { PriorityColorPipe, StatusColorPipe, CategoryIconPipe, DaysUntilPipe } from '../../pipes/task.pipes';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, DatePipe,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatDialogModule, MatSnackBarModule,
    PriorityColorPipe, StatusColorPipe, CategoryIconPipe, DaysUntilPipe
  ],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskService.getTaskById(id).subscribe(task => {
        this.task = task || null;
        if (!this.task) this.router.navigate(['/tasks']);
      });
    }
  }

  isOverdue(): boolean {
    return !!this.task?.dueDate && this.task.status !== 'completed' && new Date(this.task.dueDate) < new Date();
  }

  updateStatus(status: 'pending' | 'in_progress' | 'completed') {
    if (!this.task) return;
    this.taskService.updateStatus(this.task.id, status).subscribe(() => {
      this.snackBar.open(status === 'completed' ? '🎉 Task completed!' : 'Status updated', 'Close', { duration: 3000 });
    });
  }

  confirmDelete() {
    const ref = this.dialog.open(DeleteConfirmDialogComponent, {
      data: { title: this.task?.title },
      panelClass: 'dark-dialog'
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed && this.task) {
        this.taskService.deleteTask(this.task.id).subscribe(() => {
          this.snackBar.open('Task deleted', 'Close', { duration: 2000 });
          this.router.navigate(['/tasks']);
        });
      }
    });
  }
}