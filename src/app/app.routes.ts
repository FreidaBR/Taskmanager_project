import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskListComponent },
  { path: 'completed', component: TaskListComponent },
  { path: 'add', component: TaskFormComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: TaskFormComponent, canActivate: [AuthGuard] },
  { path: 'task/:id', component: TaskDetailComponent },
  { path: '**', redirectTo: 'tasks' }
];