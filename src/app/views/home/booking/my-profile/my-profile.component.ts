import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { AccountService } from 'src/services';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  user: User;

  constructor(
    private accountService: AccountService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if(!this.user){
      this.router.navigate(['sign-in']);
    }
  }

  back() {
    this.router.navigate(['dashboard']);
  }

}
