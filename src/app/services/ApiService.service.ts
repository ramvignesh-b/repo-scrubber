import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, expand, reduce, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private readonly http = inject(HttpClient);

    token: string = '';
    username: string = '';

    gitApi = 'https://api.github.com/';

    httpOptions: any = {}

    getRepoList(username?: string, token?: string): Observable<any[]> {
        if(username && token) {
            this.username = username;
            this.token = token;
        }

        this.httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${this.token}`
            })
        };

        return this.fetchPage(1).pipe(
            expand((pageData, index) => {
                // If pageData has 100 items, fetch the next page (index is 0-indexed, so index + 2 is page number)
                return pageData.length === 100 ? this.fetchPage(index + 2) : EMPTY;
            }),
            reduce((acc, current) => acc.concat(current), [] as any[])
        );
    }

    private fetchPage(page: number): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.gitApi}user/repos?per_page=100&page=${page}&affiliation=owner`,
            this.httpOptions
        );
    }

    deleteRepo(repo: string | null): Observable<any> {
        return this.http.delete(`${this.gitApi}repos/${this.username}/${repo}`, this.httpOptions);
    }
}
