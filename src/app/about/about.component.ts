import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcticonDirective } from '../shared/octicon.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, OcticonDirective],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {}
