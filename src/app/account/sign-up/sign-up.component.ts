import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationModel } from 'src/models';
import { Email } from 'src/models/email.model';
import { UserModel } from 'src/models/user.model';
import { NavigationService } from 'src/services';
import { AccountService } from 'src/services/account.service';
import { EmailService } from 'src/services/communication';
import { ADMIN, CUSTOMER, SYSTEM } from 'src/shared/constants';
import { IS_DELETED_FALSE, AWAITING_ACTIVATION } from 'src/shared/status.const';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  rForm: FormGroup;
  error: string;
  selectedSubjects: any[] = [];
  hidePassword = true;
  paymentTypes: any[] = [];
  paymentOption: string;
  showLoader: boolean;
  navigation: NavigationModel;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private emailService: EmailService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {

    this.navigation = this.navigationService.currentNavValue;
    this.rForm = this.fb.group({
      Email: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.email
      ])),
      Password: [null, Validators.required],
      PhoneNumber: [null, Validators.required],
      Name: [null, Validators.required],
      Surname: [null, Validators.required],
      UserType: this.navigation.Role,
      CreateUserId: [SYSTEM],
      ModifyUserId: [SYSTEM],
      IsDeleted: [IS_DELETED_FALSE],
      StatusId: [AWAITING_ACTIVATION]
    });

  }

  onSubmit(model: UserModel) {
    model.Roles = [];
    model.Dp = '';
    this.showLoader = true;

    this.accountService.register(model).subscribe(data => {
      // send email logic here.
      if (data.Email) {
        this.sendEmail(data);
        this.accountService.updateUserState(data);
        setTimeout(() => {
          this.showLoader = false;
         if(data.UserType === 'Partner') {
           this.routeTo.navigate(['dashboard/company', 'add']);
         } else {
           this.routeTo.navigate(['my-home']);
         }
       }, 1000);
      } else {
        alert(data);
        return;
      }
    });
  }



  sendEmail(data: UserModel) {
    const emailToSend: Email = {
      Email: data.Email,
      Subject: 'Cervidae: Welcome & Activation',
      Message: '',
      Link: this.accountService.generateAccountActivationReturnLink(data.UserToken)
    };

    this.showLoader = true;
    this.emailService.sendAccountActivationEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {
          // leave no message required
        }
      });
  }




}
