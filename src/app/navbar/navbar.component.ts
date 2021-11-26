import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    @Output() activeTab: EventEmitter<string> = new EventEmitter<string>();
    constructor() { }

    ngOnInit(): void {
    }

    onActive(event: any): void {
        Array.from(document.querySelectorAll('.nav-link')).forEach(link => link.classList.remove('active'))
        event.target.classList.add('active');
        this.activeTab.emit(event.target.id)
    }
}
