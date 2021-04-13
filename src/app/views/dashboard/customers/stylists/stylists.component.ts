import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { AccountService, UserService } from 'src/services';
import { COMPANY, STYLIST } from 'src/shared/constants';

@Component({
  selector: 'app-stylists',
  templateUrl: './stylists.component.html',
  styleUrls: ['./stylists.component.scss']
})
export class StylistsComponent implements OnInit {

  showModal: boolean;
  showAddCustomer: boolean;

  users: User[] = [];
  modalHeading = 'Add stylists';
  user: User;
  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.userService.getUsers(COMPANY, STYLIST);
    this.userService.userListObservable.subscribe(data => {
      this.users = data;
    });
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }
  view(user: User) {
    this.userService.updateUserState(user);
    this.router.navigate(['dashboard/stylist', user.UserId]);
  }
  add(){
    this.router.navigate(['dashboard/stylist', 'add']);
  }
  back() {
    this.router.navigate(['dashboard']);
  }

}
