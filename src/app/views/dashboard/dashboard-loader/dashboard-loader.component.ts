import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-loader',
  templateUrl: './dashboard-loader.component.html',
  styleUrls: ['./dashboard-loader.component.scss']
})
export class DashboardLoaderComponent implements OnInit {
  @Input() loader: boolean;
  @Input() message: string;
  constructor() { }

  ngOnInit() {
  }

}
