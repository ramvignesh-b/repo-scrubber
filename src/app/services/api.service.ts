import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { expand, reduce, EMPTY } from 'rxjs';

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  fork: boolean;
  private: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);

  token = '';
  username = '';

  gitApi = 'https://api.github.com/';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${this.token}`,
    });
  }

  getRepoList(username?: string, token?: string): Observable<GitHubRepo[]> {
    if (username && token) {
      this.username = username;
      this.token = token;
    }

    return this.fetchPage(1).pipe(
      expand((pageData, index) => {
        return pageData.length === 100 ? this.fetchPage(index + 2) : EMPTY;
      }),
      reduce((acc, current) => acc.concat(current), [] as GitHubRepo[]),
    );
  }

  private fetchPage(page: number): Observable<GitHubRepo[]> {
    const headers = this.getHeaders();
    return this.http.get<GitHubRepo[]>(
      `${this.gitApi}user/repos?per_page=100&page=${page}&affiliation=owner`,
      { headers },
    );
  }

  deleteRepo(repo: string | null): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.gitApi}repos/${this.username}/${repo}`, { headers });
  }
}
