import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalModel } from 'src/models/modal.model';

@Component({
  selector: 'app-user-feedback',
  templateUrl: './user-feedback.component.html',
  styleUrls: ['./user-feedback.component.scss']
})
export class UserFeedbackComponent implements OnInit {
  @Input() modalModel: ModalModel;

  // <app-user-feedback [modalModel]="modalModel">
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  goto() {
    this.router.navigate([this.modalModel.routeTo]);
  }
}
