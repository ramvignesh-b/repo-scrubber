import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from './navbar/navbar.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { RepoListComponent } from './repo-list/repo-list.component';
import { HowToComponent } from './how-to/how-to.component';
import { AboutComponent } from './about/about.component';
import { ApiService } from './services/ApiService.service';
import { OcticonDirective } from './shared/octicon.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    LoadingScreenComponent,
    RepoListComponent,
    HowToComponent,
    AboutComponent,
    OcticonDirective,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly apiService = inject(ApiService);

  username = signal('');
  token = signal('');
  enableList = signal(false);
  repoList = signal<any[]>([]);
  title = 'repo-scrubber';
  error = signal('');
  loadingScreen = signal(false);
  loadMessage = signal('Loading...');
  disableForm = signal(false);
  activeTab = signal<'scrub' | 'how-to' | 'about'>('scrub');
  hideToken = signal(true);

  validate = computed(() => this.username().trim() !== '' && this.token().trim() !== '');

  onActive(value: 'scrub' | 'how-to' | 'about') {
    this.activeTab.set(value);
  }

  apiSuccess(data: any[]) {
    if (!data || data.length === 0) {
      this.error.set('No repositories returned. Make sure the user owns repositories.');
      this.loadingScreen.set(false);
      return;
    }
    const cleaned: any[] = [];
    data.forEach((_repo) => {
      cleaned.push({
        id: _repo.id,
        name: _repo.name,
        url: _repo.html_url,
        fork: _repo.fork,
        private: _repo.private,
        created_at: _repo.created_at,
      });
    });
    this.repoList.set(cleaned);
    this.loadingScreen.set(false);
    this.disableForm.set(true);
    this.enableList.set(true);
  }

  apiError(error: any) {
    switch (error.status) {
      case 401:
        this.error.set('Invalid personal access token. Please verify its scope permissions.');
        break;
      case 404:
        this.error.set('Invalid GitHub credentials or username not found.');
        break;
      default:
        this.error.set(
          'An error occurred while connecting to GitHub API. Please check your connection.',
        );
        break;
    }
    this.loadingScreen.set(false);
    console.error(error);
  }

  pageLoader(value: boolean): void {
    this.loadMessage.set('Deleting repositories...');
    this.loadingScreen.set(value);
  }

  onSubmit() {
    this.error.set('');
    this.loadingScreen.set(true);
    this.loadMessage.set('Retrieving repositories...');
    this.apiService.getRepoList(this.username(), this.token()).subscribe({
      next: (data: any[]) => this.apiSuccess(data),
      error: (err: any) => this.apiError(err),
    });
  }
}
