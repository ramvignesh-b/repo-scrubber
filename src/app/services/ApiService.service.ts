import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { expand, reduce, EMPTY } from 'rxjs';

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

  getRepoList(username?: string, token?: string): Observable<any[]> {
    if (username && token) {
      this.username = username;
      this.token = token;
    }

    return this.fetchPage(1).pipe(
      expand((pageData, index) => {
        // If pageData has 100 items, fetch the next page (index is 0-indexed, so index + 2 is page number)
        return pageData.length === 100 ? this.fetchPage(index + 2) : EMPTY;
      }),
      reduce((acc, current) => acc.concat(current), [] as any[]),
    );
  }

  private fetchPage(page: number): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(
      `${this.gitApi}user/repos?per_page=100&page=${page}&affiliation=owner`,
      { headers },
    );
  }

  deleteRepo(repo: string | null): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.gitApi}repos/${this.username}/${repo}`, { headers });
  }
}
