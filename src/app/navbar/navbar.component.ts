import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    @Output() activeTab = new EventEmitter<'scrub' | 'how-to' | 'about'>();
    activeId: 'scrub' | 'how-to' | 'about' = 'scrub';

    setActive(tabId: 'scrub' | 'how-to' | 'about'): void {
        this.activeId = tabId;
        this.activeTab.emit(tabId);
    }
}
