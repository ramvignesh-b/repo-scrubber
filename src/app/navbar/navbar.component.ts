import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcticonDirective } from '../shared/octicon.directive';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, OcticonDirective],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    @Output() activeTab = new EventEmitter<'scrub' | 'how-to' | 'about'>();
    activeId = signal<'scrub' | 'how-to' | 'about'>('scrub');

    setActive(tabId: 'scrub' | 'how-to' | 'about'): void {
        this.activeId.set(tabId);
        this.activeTab.emit(tabId);
    }
}
