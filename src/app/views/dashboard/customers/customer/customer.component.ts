import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services/account.service';
import { UserService } from 'src/services/user.service';
import { COMPANY, STATUS_ACTIVE, STATUS_DELETED } from 'src/shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customer: User;
  userId: string;
  showModal: boolean;
  modalHeading: string;
  user: User;
  selectedIndex = 0;
  heading: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private accountService: AccountService,
    private _snackBar: MatSnackBar

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.userId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;

    if (this.userId !== 'add') {
      this.customer = this.userService.currentUserValue;
      this.heading = `${this.customer.Name} ${this.customer.Surname}`;
      this.userService.getUser(this.userId);
      this.userService.userObservable.subscribe(user => {
        this.customer = user;
      });
    } else {
      this.customer = {
        UserId: '',
        CompanyId: this.user.CompanyId,
        UserType: 'Customer',
        Name: '',
        Surname: '',
        Email: '',
        PhoneNumber: '',
        Password: 'notset',
        Dp: '',
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: '1',
        UserToken: ''
      };
      this.heading = `Adding new customer`;
    }

  }

  back() {
    this.router.navigate([`/dashboard/customers`]);
  }
  add() {
    this.showModal = true;
    this.modalHeading = `Assign Subjects to  ${this.customer && this.customer.Name}`;
  }
  closeModal() {
    this.showModal = false;
  }

  openSnackBar(message, heading) {
    const snackBarRef = this._snackBar.open(message, heading, {
      duration: 3000
    });

  }
  saveAll() { }
}
