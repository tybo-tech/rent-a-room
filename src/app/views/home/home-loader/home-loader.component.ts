import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-loader',
  templateUrl: './home-loader.component.html',
  styleUrls: ['./home-loader.component.scss']
})
export class HomeLoaderComponent implements OnInit {
  @Input() loader: boolean;
  @Input() message: string;
  constructor() { }

  ngOnInit() {
  }
}
