import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../services/ApiService.service';

@Component({
    selector: 'app-repo-list',
    templateUrl: './repo-list.component.html',
    styleUrls: ['./repo-list.component.scss']
})
export class RepoListComponent implements OnInit {
    @Input() repoList: any = [];
    @Output() load: EventEmitter<boolean> = new EventEmitter<boolean>();
    toDelete: any = [];
    disabled: boolean = true;

    constructor(
        private readonly apiService: ApiService
    ) { }

    ngOnInit(): void {
    }

    toastIt(repo: string | null, error?: 'error'): void {
        const toastDiv = document.querySelector('#toastItems');
        const newToast = document.createElement('div');
        const message: string = error ? (repo ? 'could not be deleted!' : 'You must a select a repo to perfom this action!') : 'was deleted successfully!'
        newToast.className = `toast align-items-center ${error ? 'bg-danger' : 'bg-success'} show top-0 end-0`;
        newToast.setAttribute('role', 'alert');
        newToast.setAttribute('aria-live', 'assertive');
        newToast.setAttribute('aria-atomic', 'true');
        newToast.setAttribute('data-bs-autohide', 'true');
        newToast.setAttribute('data-bs-animation', 'true');
        const flexDiv = document.createElement('div');
        flexDiv.className = "d-flex";
        const toastBody = document.createElement('div');
        toastBody.className = "toast-body text-light";
        toastBody.innerHTML = `<strong>${repo}<strong> ${message}`;
        const closeBtn = document.createElement('button');
        closeBtn.className = "btn-close me-2 m-auto";
        closeBtn.setAttribute('data-bs-dismiss', 'toast');
        closeBtn.setAttribute('aria-label', 'close');
        flexDiv.appendChild(toastBody);
        flexDiv.appendChild(closeBtn);
        newToast.appendChild(flexDiv);
        toastDiv?.appendChild(newToast);
        console.log(newToast);
        setTimeout(() => {
            newToast.classList.remove('show');
        }, 6000);
    }

    onChange(event: any) {
        this.disabled = (document.querySelectorAll('input[type="checkbox"]:checked').length) ? false : true;
    }

    onDelete(): void {
        const deleteList = document.querySelectorAll('input[type="checkbox"]:checked');
        this.loadScreen(true);
        Array.from(deleteList).forEach(repo => this.apiService.deleteRepo(repo.getAttribute('name')).subscribe((data => this.toastIt(repo.getAttribute('name'))), (error) => this.toastIt(repo.getAttribute('name'), 'error')));
        setTimeout(() => {
            this.reset();
            this.loadScreen(false);
        }, 3000);
    }

    reset(): void {
        const checkBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
        Array.from(checkBoxes).forEach(checkbox => {
            checkbox.setAttribute('checked', 'false');
        });
        this.repoList = [];
        this.apiService.getRepoList().subscribe((data: any) => data.forEach((_repo: any) => {
            this.repoList.push({
                "id": _repo.id,
                "name": _repo.name,
                "url": _repo.html_url,
                "fork": _repo.fork,
                "private": _repo.private
            })
        }));
    }

    loadScreen(value: boolean) {
        this.load.emit(value);
    }
}
