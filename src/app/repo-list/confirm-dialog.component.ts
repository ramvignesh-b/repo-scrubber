import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="warn-icon">warning</mat-icon>
        Confirm Bulk Deletion
      </h2>
      
      <mat-dialog-content class="dialog-content">
        <p class="warning-text">
          Are you sure you want to permanently delete these <strong>{{ data.repos.length }}</strong> repositories?
        </p>
        <p class="irreversible-text">This action is <strong>irreversible</strong>.</p>
        
        <div class="repos-list-container">
          <mat-list class="repos-list">
            <mat-list-item *ngFor="let repo of data.repos">
              <mat-icon matListItemIcon class="repo-icon">folder</mat-icon>
              <span matListItemTitle class="repo-name">{{ repo }}</span>
            </mat-list-item>
          </mat-list>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-btn">Cancel</button>
        <button mat-flat-button color="warn" (click)="onConfirm()" class="confirm-btn">
          <mat-icon>delete_forever</mat-icon>
          Yes, Delete
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      background-color: #1e1e1e;
      color: #fff;
      padding: 8px;
    }
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #f44336;
      font-size: 1.4rem;
      font-weight: 500;
      margin: 0 0 16px 0;
      border-bottom: 1px solid #333;
      padding-bottom: 12px;
    }
    .warn-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #f44336;
    }
    .dialog-content {
      color: #b0b0b0;
      font-size: 0.95rem;
      line-height: 1.5;
      max-height: 300px;
      overflow-y: auto;
    }
    .warning-text {
      margin-bottom: 8px;
    }
    .irreversible-text {
      color: #f44336;
      font-weight: 500;
      margin-bottom: 16px;
    }
    .repos-list-container {
      background-color: #121212;
      border: 1px solid #333;
      border-radius: 6px;
      padding: 4px;
      margin-bottom: 8px;
    }
    .repos-list {
      max-height: 180px;
      overflow-y: auto;
    }
    .repo-icon {
      color: #ffb300;
    }
    .repo-name {
      color: #e0e0e0;
      font-family: monospace;
      font-size: 0.9rem;
    }
    .dialog-actions {
      padding-top: 16px;
      border-top: 1px solid #333;
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
    button {
      border-radius: 20px !important;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    .cancel-btn {
      color: #b0b0b0 !important;
      &:hover {
        background-color: rgba(255, 255, 255, 0.05) !important;
      }
    }
    .confirm-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 12px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { repos: string[] }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
