import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcticonDirective } from '../shared/octicon.directive';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule, OcticonDirective],
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent {
  @Input() show: boolean = false;
  @Input() message: string = '';
}
