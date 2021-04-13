import { Component, OnInit } from '@angular/core';
import { User } from 'src/models';
import { AccountService } from 'src/services';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  user: User;
  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
  }

}
