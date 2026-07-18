import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcticonDirective } from '../shared/octicon.directive';

@Component({
  selector: 'app-how-to',
  standalone: true,
  imports: [CommonModule, OcticonDirective],
  templateUrl: './how-to.component.html',
  styleUrls: ['./how-to.component.scss'],
})
export class HowToComponent {}
