import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ApiService } from '../services/ApiService.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
    selector: 'app-repo-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatSnackBarModule
    ],
    templateUrl: './repo-list.component.html',
    styleUrls: ['./repo-list.component.scss']
})
export class RepoListComponent implements OnInit {
    @Input() repoList: any[] = [];
    @Output() load: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('repoListSelection') repoListSelection!: MatSelectionList;

    repoListOG: any[] = [];
    filteredRepoList: any[] = [];
    searchText: string = '';
    filterType: 'all' | 'forked' | 'original' = 'all';
    disabledDelete: boolean = true;

    constructor(
        private readonly apiService: ApiService,
        private readonly dialog: MatDialog,
        private readonly snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.repoListOG = this.repoList;
        this.applyFilters();
    }

    applyFilters(): void {
        let list = this.repoListOG;

        // Apply text filter
        if (this.searchText.trim() !== '') {
            const query = this.searchText.toLowerCase();
            list = list.filter(repo => repo.name.toLowerCase().includes(query));
        }

        // Apply category filter
        if (this.filterType === 'forked') {
            list = list.filter(repo => repo.fork);
        } else if (this.filterType === 'original') {
            list = list.filter(repo => !repo.fork);
        }

        this.filteredRepoList = list;
        setTimeout(() => this.updateDeleteButtonState());
    }

    onSelectionChange(): void {
        this.updateDeleteButtonState();
    }

    updateDeleteButtonState(): void {
        if (!this.repoListSelection) {
            this.disabledDelete = true;
            return;
        }
        this.disabledDelete = this.repoListSelection.selectedOptions.selected.length === 0;
    }

    onDeleteClick(): void {
        const selectedRepos = this.repoListSelection.selectedOptions.selected.map(opt => opt.value);
        
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '450px',
            data: { repos: selectedRepos },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.performDeletion(selectedRepos);
            }
        });
    }

    performDeletion(repos: string[]): void {
        this.load.emit(true);
        let completedCount = 0;
        let successCount = 0;
        let failCount = 0;

        repos.forEach(repo => {
            this.apiService.deleteRepo(repo).subscribe({
                next: () => {
                    successCount++;
                    this.snackBar.open(`Successfully deleted ${repo}`, 'Dismiss', {
                        duration: 3000
                    });
                    this.checkProgress(repos.length, ++completedCount, successCount, failCount);
                },
                error: (err) => {
                    failCount++;
                    this.snackBar.open(`Failed to delete ${repo}`, 'Dismiss', {
                        duration: 4000
                    });
                    console.error(err);
                    this.checkProgress(repos.length, ++completedCount, successCount, failCount);
                }
            });
        });
    }

    checkProgress(total: number, completed: number, success: number, fail: number): void {
        if (completed === total) {
            setTimeout(() => {
                this.load.emit(false);
                this.snackBar.open(`Scrubbing complete. Success: ${success}, Failed: ${fail}`, 'OK', {
                    duration: 5000
                });
                this.reset();
            }, 1000);
        }
    }

    reset(): void {
        this.repoList = [];
        this.filteredRepoList = [];
        this.searchText = '';
        this.filterType = 'all';
        this.disabledDelete = true;
        
        this.apiService.getRepoList().subscribe({
            next: (data: any) => {
                this.repoList = [];
                data.forEach((_repo: any) => {
                    this.repoList.push({
                        "id": _repo.id,
                        "name": _repo.name,
                        "url": _repo.html_url,
                        "fork": _repo.fork,
                        "private": _repo.private
                    });
                });
                this.repoListOG = this.repoList;
                this.applyFilters();
            },
            error: (err) => {
                this.snackBar.open('Failed to refresh repository list.', 'Retry', { duration: 5000 })
                    .onAction().subscribe(() => this.reset());
            }
        });
    }
}
