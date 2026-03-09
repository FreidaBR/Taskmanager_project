import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatDatepickerModule, MatNativeDateModule,
    MatSnackBarModule, MatCardModule, MatIconModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  isLoading = false;

  categories = ['Work', 'Personal', 'Health', 'Learning', 'Other'];
  priorities = ['low', 'medium', 'high'];
  statuses = ['pending', 'in_progress', 'completed'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initForm();
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditMode = true;
      this.taskService.getTaskById(this.taskId).subscribe(task => {
        if (task) this.taskForm.patchValue({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          tags: task.tags.join(', ')
        });
      });
    }
  }

  private initForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      category: ['Work', Validators.required],
      priority: ['medium', Validators.required],
      status: ['pending', Validators.required],
      dueDate: [null],
      tags: ['']
    });
  }

  get titleErrors() {
    const c = this.taskForm.get('title');
    if (c?.hasError('required')) return 'Title is required';
    if (c?.hasError('minlength')) return 'Min 3 characters';
    if (c?.hasError('maxlength')) return 'Max 100 characters';
    return '';
  }

  onSubmit() {
    if (this.taskForm.invalid) { this.taskForm.markAllAsTouched(); return; }
    this.isLoading = true;
    const val = this.taskForm.value;
    const taskData: Partial<Task> = {
      ...val,
      dueDate: val.dueDate ? new Date(val.dueDate).toISOString().split('T')[0] : '',
      tags: val.tags ? val.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []
    };

    if (this.isEditMode && this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe(existing => {
        if (existing) {
          this.taskService.updateTask({ ...existing, ...taskData } as Task).subscribe(() => {
            this.snackBar.open('Task updated!', 'Close', { duration: 3000 });
            this.router.navigate(['/tasks']);
          });
        }
      });
    } else {
      this.taskService.addTask(taskData).subscribe(() => {
        this.snackBar.open('Task created!', 'Close', { duration: 3000 });
        this.router.navigate(['/tasks']);
      });
    }
    this.isLoading = false;
  }
}