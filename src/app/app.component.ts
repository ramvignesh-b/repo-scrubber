import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NavbarComponent } from './navbar/navbar.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { RepoListComponent } from './repo-list/repo-list.component';
import { HowToComponent } from './how-to/how-to.component';
import { AboutComponent } from './about/about.component';
import { ApiService } from './services/ApiService.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        NavbarComponent,
        LoadingScreenComponent,
        RepoListComponent,
        HowToComponent,
        AboutComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private readonly apiService: ApiService,
    ) { }
    
    username: string = '';
    token: string = '';
    enableList: boolean = false;
    repoList: any[] = [];
    repoListOG: any[] = [];
    title = 'repo-scrubber';
    error: string = '';
    loadingScreen: boolean = false;
    loadMessage: string = 'Loading...';
    disableForm: boolean = false;
    validate: boolean = false;
    activeTab: 'scrub' | 'how-to' | 'about' = 'scrub';
    hideToken: boolean = true;

    inputChange(event: any) {
        this.validate = (this.username.trim() !== '' && this.token.trim() !== '') ? true : false;
    }

    onActive(value: any) {
        this.activeTab = value;
    }

    apiSuccess(data: any[]) {
        if (!data) {
            this.error = "No repositories returned.";
            this.loadingScreen = false;
            return;
        }
        this.repoListOG = [];
        data.forEach(_repo => {
            this.repoListOG.push({
                "id": _repo.id,
                "name": _repo.name,
                "url": _repo.html_url,
                "fork": _repo.fork,
                "private": _repo.private
            });
        });
        this.repoList = this.repoListOG;
        this.loadingScreen = false;
        this.disableForm = true;
        this.enableList = true;
    }

    apiError(error: any) {
        switch (error.status) {
            case 401:
                this.error = "Invalid personal access token. Please verify its permissions.";
                break;
            case 404:
                this.error = "Invalid GitHub username. User not found.";
                break;
            default:
                this.error = "An error occurred while connecting to GitHub API.";
                break;
        }
        this.loadingScreen = false;
        console.error(error);
    }

    pageLoader(value: any): void {
        this.loadMessage = 'Deleting repositories...';
        this.loadingScreen = value;
    }

    onSubmit() {
        this.error = '';
        this.loadingScreen = true;
        this.loadMessage = 'Retrieving repositories...';
        this.apiService.getRepoList(this.username, this.token).subscribe({
            next: (data: any) => this.apiSuccess(data),
            error: (err: any) => this.apiError(err)
        });
    }
}
