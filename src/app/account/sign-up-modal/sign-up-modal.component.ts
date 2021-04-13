import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Email } from 'src/models/email.model';
import { User, UserModel } from 'src/models/user.model';
import { AccountService } from 'src/services/account.service';
import { EmailService } from 'src/services/communication';
import { ADMIN, CUSTOMER, SYSTEM } from 'src/shared/constants';
import { IS_DELETED_FALSE, AWAITING_ACTIVATION } from 'src/shared/status.const';

@Component({
  selector: 'app-sign-up-modal',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.scss']
})
export class SignUpModalComponent implements OnInit {
  @Output() userLoggedInDone: EventEmitter<User> = new EventEmitter<User>();
  rForm: FormGroup;
  error: string;
  selectedSubjects: any[] = [];
  hidePassword = true;
  paymentTypes: any[] = [];
  paymentOption: string;
  showLoader: boolean;

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private emailService: EmailService
  ) { }

  ngOnInit() {

    this.rForm = this.fb.group({
      Email: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.email
      ])),
      Password: [null, Validators.required],
      PhoneNumber: [null, Validators.required],
      Name: [null, Validators.required],
      // CompanyName: [null, Validators.required],
      Surname: [null, Validators.required],
      UserType: CUSTOMER,
      CreateUserId: [SYSTEM],
      ModifyUserId: [SYSTEM],
      IsDeleted: [IS_DELETED_FALSE],
      StatusId: [AWAITING_ACTIVATION]
    });

  }

  onSubmit(model: UserModel) {
    model.Roles = [];
    model.Roles.push({ Name: CUSTOMER });
    model.Dp = '';
    this.showLoader = true;

    this.accountService.register(model).subscribe(data => {
      // send email logic here.
      if (data.Email) {
        this.accountService.updateUserState(data);
        this.userLoggedInDone.emit(data);
        this.sendEmail(data);
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
        // if (response > 0) {
        //   setTimeout(() => {
        //     this.showLoader = false;
        //     alert('Account Registered successfully, PLEASE Check your email for activation');
        //     this.routeTo.navigate(['my-home']);
        //   }, 1000);
        // }
      });
  }



}
