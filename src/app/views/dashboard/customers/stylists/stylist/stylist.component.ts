import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/models';
import { UserService, AccountService } from 'src/services';
import { STYLIST } from 'src/shared/constants';

@Component({
  selector: 'app-stylist',
  templateUrl: './stylist.component.html',
  styleUrls: ['./stylist.component.scss']
})
export class StylistComponent implements OnInit {

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
        UserType: STYLIST,
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
      this.heading = `Adding new stylist`;
    }

  }

  back() {
    this.router.navigate([`/dashboard/stylists`]);
  }
  add() {
    this.showModal = true;
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
