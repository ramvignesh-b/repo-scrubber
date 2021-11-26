import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
    constructor(
        private http: HttpClient
    ) { }

    token: string = '';
    username: string = '';

    gitApi = 'https://api.github.com/';

    httpOptions: any = {}

    getRepoList(username?: string, token?: string): Observable<any> {
        if(username && token) {
            this.username = username;
            this.token = token;
        }

        this.httpOptions = {
            headers: { 'Content-Type': 'application/vnd.github.v3+json', 'Authorization': `token ${this.token}`}
        };
        return this.http.get(`${this.gitApi}users/${this.username}/repos?per_page=100`, this.httpOptions)
    }
    deleteRepo(repo: string | null): Observable<any> {
        return this.http.delete(`${this.gitApi}repos/${this.username}/${repo}`, this.httpOptions);
    }
}
