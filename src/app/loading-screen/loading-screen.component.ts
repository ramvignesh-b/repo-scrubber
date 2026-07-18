import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcticonDirective } from '../shared/octicon.directive';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule, OcticonDirective],
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent {
  show = input<boolean>(false);
  message = input<string>('');
}
