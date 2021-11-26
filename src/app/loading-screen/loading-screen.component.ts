import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {
@Input() show: boolean = false;
@Input() message: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
