import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services/account.service';
import { UserService } from 'src/services/user.service';
import { CUSTOMER, COMPANY } from 'src/shared/constants';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  showModal: boolean;
  showAddCustomer: boolean;

  users: User[] = [];
  modalHeading = 'Add customer';
  user: User;
  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.userService.getUsers(COMPANY, CUSTOMER);
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
    this.router.navigate(['dashboard/customer', user.UserId]);
  }
  add(){
    this.router.navigate(['dashboard/customer', 'add']);
  }
  back() {
    this.router.navigate(['dashboard']);
  }
}
