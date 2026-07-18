import { Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/ApiService.service';

@Component({
    selector: 'app-repo-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './repo-list.component.html',
    styleUrls: ['./repo-list.component.scss']
})
export class RepoListComponent {
    private readonly apiService = inject(ApiService);

    repoList = input<any[]>([]);
    load = output<boolean>();
    refresh = output<void>();

    searchText = signal('');
    filterType = signal<'all' | 'forked' | 'original'>('all');
    selectedRepos = signal<Set<string>>(new Set());
    showConfirmModal = signal(false);
    flashes = signal<{ message: string, type: 'success' | 'error' }[]>([]);

    filteredRepoList = computed(() => {
        let list = this.repoList();
        const search = this.searchText().trim().toLowerCase();
        if (search) {
            list = list.filter(repo => repo.name.toLowerCase().includes(search));
        }
        const type = this.filterType();
        if (type === 'forked') {
            list = list.filter(repo => repo.fork);
        } else if (type === 'original') {
            list = list.filter(repo => !repo.fork);
        }
        return list;
    });

    disabledDelete = computed(() => this.selectedRepos().size === 0);

    isAllSelected = computed(() => {
        const filtered = this.filteredRepoList();
        if (filtered.length === 0) return false;
        return filtered.every(repo => this.selectedRepos().has(repo.name));
    });

    isSomeSelected = computed(() => {
        const selectedCount = this.selectedRepos().size;
        return selectedCount > 0 && !this.isAllSelected();
    });

    toggleSelect(name: string): void {
        const current = new Set(this.selectedRepos());
        if (current.has(name)) {
            current.delete(name);
        } else {
            current.add(name);
        }
        this.selectedRepos.set(current);
    }

    toggleSelectAll(event: any): void {
        const checked = event.target.checked;
        const current = new Set<string>();
        if (checked) {
            this.filteredRepoList().forEach(repo => current.add(repo.name));
        }
        this.selectedRepos.set(current);
    }

    showFlash(message: string, type: 'success' | 'error'): void {
        const newFlash = { message, type };
        this.flashes.set([...this.flashes(), newFlash]);
        setTimeout(() => {
            this.flashes.set(this.flashes().filter(f => f !== newFlash));
        }, 5000);
    }

    onDeleteClick(): void {
        this.showConfirmModal.set(true);
    }

    onConfirmClose(): void {
        this.showConfirmModal.set(false);
    }

    onConfirmDelete(): void {
        this.showConfirmModal.set(false);
        const reposArray = Array.from(this.selectedRepos());
        this.performDeletion(reposArray);
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
                    this.showFlash(`Successfully deleted ${repo}`, 'success');
                    this.checkProgress(repos.length, ++completedCount, successCount, failCount);
                },
                error: (err) => {
                    failCount++;
                    this.showFlash(`Failed to delete ${repo}`, 'error');
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
                this.showFlash(`Scrubbing complete. Success: ${success}, Failed: ${fail}`, 'success');
                this.reset();
            }, 1000);
        }
    }

    reset(): void {
        this.searchText.set('');
        this.filterType.set('all');
        this.selectedRepos.set(new Set());
        this.refresh.emit();
    }
}
