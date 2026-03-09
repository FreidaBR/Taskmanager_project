import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-content">
      <h2 mat-dialog-title>Delete Task?</h2>
      <mat-dialog-content>
        <p>Are you sure you want to delete <strong>"{{ data.title }}"</strong>? This cannot be undone.</p>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-stroked-button (click)="ref.close(false)">Cancel</button>
        <button mat-raised-button color="warn" (click)="ref.close(true)">Delete Task</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-content { background: #16161e; color: #e2e8f0; padding: 24px; border-radius: 16px; }
    h2 { color: #e2e8f0; margin: 0 0 16px; }
    p { color: #94a3b8; }
    mat-dialog-actions { display: flex; gap: 10px; justify-content: flex-end; padding-top: 16px; }
  `]
})
export class DeleteConfirmDialogComponent {
  constructor(
    public ref: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}
}