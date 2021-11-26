import { Component } from '@angular/core';
import { ApiService } from './services/ApiService.service'

@Component({
    selector: 'app-root',
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
    title = 'repo-scrubber';
    error: string = '';
    loadingScreen: boolean = false;
    loadMessage: string = 'Loading...';
    disableForm: boolean = false;
    validate: boolean = false;

    inputChange(event: any) {
        this.validate = (this.username != '' && this.token != '') ? true : false;
    }

    apiSuccess(data: any[]) {
        if(!data)
            this.error = "No repo returned"
        data.forEach(_repo => {
            this.repoList.push({
                "id": _repo.id,
                "name": _repo.name,
                "url": _repo.html_url,
                "fork": _repo.fork,
                "private": _repo.private
            })
        })
        this.loadingScreen = false;
        this.disableForm = true;
        this.enableList = true;
    }

    apiError(error: any) {
        switch (error.status) {
            case 401:
                this.error = "Invalid token";
                break;
            case 404:
                this.error = "Invalid username";
                break;
            default:
                this.error = "Unknown Error";
                break;
        }
        this.loadingScreen = false;
        console.error(error);
    }

    pageLoader(value: any): void {
        this.loadMessage = 'Deleting repo....';
        this.loadingScreen = value;
    }

    onSubmit() {
        this.error = '';
        this.loadingScreen = true;
        this.loadMessage = 'Retrieving User....';
        this.apiService.getRepoList(this.username, this.token).subscribe((data: any) => this.apiSuccess(data), (data:any) => this.apiError(data));
    }

}
