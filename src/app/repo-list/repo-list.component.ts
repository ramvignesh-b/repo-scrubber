import { Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, GitHubRepo } from '../services/api.service';
import { OcticonDirective } from '../shared/octicon.directive';

@Component({
  selector: 'app-repo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, OcticonDirective],
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.scss'],
})
export class RepoListComponent {
  private readonly apiService = inject(ApiService);

  repoList = input<GitHubRepo[]>([]);
  loadList = output<boolean>();
  refresh = output<void>();

  searchText = signal('');
  visibilityFilter = signal<'all' | 'public' | 'private'>('all');
  typeFilter = signal<'all' | 'original' | 'forked'>('all');
  sortBy = signal<'name' | 'date'>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  selectedRepos = signal<Set<string>>(new Set());
  showConfirmModal = signal(false);
  flashes = signal<{ message: string; type: 'success' | 'error' | 'info' }[]>([]);

  filteredRepoList = computed(() => {
    let list = this.repoList();

    const search = this.searchText().trim().toLowerCase();
    if (search) {
      list = list.filter((repo) => repo.name.toLowerCase().includes(search));
    }

    // Visibility filter
    const visibility = this.visibilityFilter();
    if (visibility === 'public') {
      list = list.filter((repo) => !repo.private);
    } else if (visibility === 'private') {
      list = list.filter((repo) => repo.private);
    }

    // Type filter
    const type = this.typeFilter();
    if (type === 'forked') {
      list = list.filter((repo) => repo.fork);
    } else if (type === 'original') {
      list = list.filter((repo) => !repo.fork);
    }

    // Sort
    const field = this.sortBy();
    const direction = this.sortDirection();
    list = [...list].sort((a, b) => {
      let comparison = 0;
      if (field === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (field === 'date') {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        comparison = dateA - dateB;
      }
      return direction === 'asc' ? comparison : -comparison;
    });

    return list;
  });

  disabledDelete = computed(() => this.selectedRepos().size === 0);

  isAllSelected = computed(() => {
    const filtered = this.filteredRepoList();
    if (filtered.length === 0) return false;
    return filtered.every((repo) => this.selectedRepos().has(repo.name));
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

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = new Set<string>();
    if (checked) {
      this.filteredRepoList().forEach((repo) => {
        current.add(repo.name);
      });
    }
    this.selectedRepos.set(current);
  }

  setVisibilityFilter(value: 'all' | 'public' | 'private'): void {
    if (value === 'all') {
      this.visibilityFilter.set('all');
    } else {
      if (this.visibilityFilter() === value) {
        this.visibilityFilter.set('all');
      } else {
        this.visibilityFilter.set(value);
      }
    }
  }

  setTypeFilter(value: 'all' | 'original' | 'forked'): void {
    if (value === 'all') {
      this.typeFilter.set('all');
    } else {
      if (this.typeFilter() === value) {
        this.typeFilter.set('all');
      } else {
        this.typeFilter.set(value);
      }
    }
  }

  showFlash(message: string, type: 'success' | 'error' | 'info'): void {
    const newFlash = { message, type };
    this.flashes.set([...this.flashes(), newFlash]);
    setTimeout(() => {
      this.flashes.set(this.flashes().filter((f) => f !== newFlash));
    }, 5000);
  }

  dismissFlash(flash: { message: string; type: 'success' | 'error' | 'info' }): void {
    this.flashes.set(this.flashes().filter((f) => f !== flash));
  }

  onDeleteClick(): void {
    this.showConfirmModal.set(true);
  }

  onConfirmClose(): void {
    this.showConfirmModal.set(false);
  }

  onConfirmDelete(): void {
    this.showConfirmModal.set(false);
    const reposToDelete = Array.from(this.selectedRepos());
    this.performDeletion(reposToDelete);
  }

  performDeletion(repos: string[]): void {
    this.loadList.emit(true);
    let completedCount = 0;
    let successCount = 0;
    let failCount = 0;

    repos.forEach((repo) => {
      this.apiService.deleteRepo(repo).subscribe({
        next: () => {
          successCount++;
          this.showFlash(`Successfully deleted ${repo}`, 'success');
          this.checkProgress(repos.length, ++completedCount, successCount, failCount);
        },
        error: (err) => {
          failCount++;
          const errMsg = err?.error?.message ? `: ${err.error.message}` : '';
          this.showFlash(`Failed to delete ${repo}${errMsg}`, 'error');
          console.error(err);
          this.checkProgress(repos.length, ++completedCount, successCount, failCount);
        },
      });
    });
  }

  checkProgress(total: number, completed: number, success: number, fail: number): void {
    if (completed === total) {
      setTimeout(() => {
        this.loadList.emit(false);
        this.showFlash(`Scrubbing complete. Success: ${success}, Failed: ${fail}`, 'info');
        this.reset();
      }, 1000);
    }
  }

  toggleSort(field: 'name' | 'date'): void {
    if (this.sortBy() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
  }

  reset(): void {
    this.searchText.set('');
    this.visibilityFilter.set('all');
    this.typeFilter.set('all');
    this.sortBy.set('name');
    this.sortDirection.set('asc');
    this.selectedRepos.set(new Set());
    this.refresh.emit();
  }
}
