import { Component, Output, EventEmitter, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcticonDirective } from '../shared/octicon.directive';

type Tab = 'scrub' | 'how-to' | 'about';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, OcticonDirective],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  /** Parent can push the active tab in (e.g. from the "Read Setup Guide" link) */
  selectedTab = input<Tab>('scrub');

  /** Emits to parent when a tab button is clicked */
  @Output() activeTab = new EventEmitter<Tab>();

  /** Internal reactive state — stays in sync with selectedTab input */
  activeId = signal<Tab>('scrub');

  constructor() {
    // Keep internal signal in sync whenever parent changes selectedTab
    effect(() => {
      this.activeId.set(this.selectedTab());
    });
  }

  setActive(tabId: Tab): void {
    this.activeId.set(tabId);
    this.activeTab.emit(tabId);
  }
}
