import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { NavigationModel, User, Email, UserModel } from 'src/models';
import { MessageDialogUx } from 'src/models/UxModel.model';
import { AccountService, EmailService, NavigationService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { SYSTEM } from 'src/shared/constants';
import { AWAITING_ACTIVATION, IS_DELETED_FALSE } from 'src/shared/status.const';
import { Slides } from '../intro-page/intro-page.component';

@Component({
  selector: 'app-partner-welcome',
  templateUrl: './partner-welcome.component.html',
  styleUrls: ['./partner-welcome.component.scss']
})
export class PartnerWelcomeComponent implements OnInit {

  slides: Slides[];
  index = 0;
  user: User;
  navigation: NavigationModel = {};
  rForm: FormGroup;
  rForm2: FormGroup;
  email;
  showMore: boolean;
  showLoader: boolean;
  hidePassword = true;
  dialogUx: MessageDialogUx = {};

  constructor(private router: Router,
    private accountService: AccountService,
    private fb: FormBuilder,
    private emailService: EmailService,
    private navigationService: NavigationService,
    private uxService: UxService,) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.navigation.Role = 'Partner';
      this.navigationService.updateNavigationState(this.navigation);
      this.rForm = this.fb.group({
        Email: new FormControl(
          this.email,
          Validators.compose([
            Validators.required,
            Validators.email
          ])
        )
      });
    } else {
      this.router.navigate(['dashboard']);
    }
    this.slides = [
      {
        Url: 'assets/images/p-slide-1.svg',
        Class: [],
        Selected: true,
        h1: 'Generate more leads',
        p: 'Through our followership on the socials we will drive traffic to your business increasing sales.'
      },
      {
        Url: 'assets/images/p-slide-2.svg',
        Class: [],
        Selected: false,
        h1: 'Centralized tools for productivity',
        p: 'Our intuitive dashboards will allow travel experience providers up to date data of their business.'
      },
      {
        Url: 'assets/images/p-slide-3.svg',
        Class: [],
        Selected: false,
        h1: 'Increase your revenue stream',
        p: 'Cervidae is dedicated to exposing travel experiences in Southern Africa.'
      }
    ];
  }

  continue(model: UserModel) {
    this.email = model.Email;
    this.loadSecondForm();
    this.showMore = !this.showMore;
  }

  loadSecondForm() {
    this.rForm2 = this.fb.group({
      Email: new FormControl(
        this.email,
        Validators.compose([
          Validators.required,
          Validators.email
        ])
      ),
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
    this.uxService.updateLoadingState({ Loading: true, Message: 'Saving your information, please wait...' });
    this.accountService.register(model).subscribe(data => {
      // send email logic here.
      if (data.Email) {
        this.sendEmail(data);
        this.accountService.updateUserState(data);
        this.user = data;
        setTimeout(() => {
          this.showLoader = false;
          this.uxService.updateLoadingState({ Loading: false, Message: undefined });
          this.dialogUx.CtaLabel = 'Create Company';
          this.dialogUx.Message = 'Your information has been captured successfully';
          this.dialogUx.IsSuccess = true;
          this.dialogUx.CtaNav = 'addCompany';
          this.dialogUx.ShowDialog = true;
          this.dialogUx.IconUrl = 'assets/images/common/check.svg';
          this.uxService.updateDialogState(this.dialogUx);
        }, 1000);
      } else {
        this.uxService.updateLoadingState({ Loading: false, Message: undefined });
        console.log(data);
        this.dialogUx.CtaLabel = 'Continue';
        this.dialogUx.Message = 'Oops, Something went wrong please try again later.';
        this.dialogUx.IsSuccess = false;
        this.dialogUx.CtaNav = '';
        this.dialogUx.ShowDialog = true;
        this.dialogUx.IconUrl = 'assets/images/common/close.svg';
        this.uxService.updateDialogState(this.dialogUx);
        return;
      }
    });

  }

  onDialogContinueClick($event) {
    this.uxService.updateDialogState(null);
    if (this.user.UserType === 'Partner') {
      this.router.navigate(['dashboard/company', 'add']);
    } else {
      this.router.navigate(['dashboard']);
    }
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
