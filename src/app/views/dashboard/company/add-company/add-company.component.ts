import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Company, User } from 'src/models';
import { MessageDialogUx } from 'src/models/UxModel.model';
import { AccountService, CompanyService, UploadService, UserService } from 'src/services';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {
  @Input() company: Company;
  showLoader: boolean;
  user: User;
  dialogUx: MessageDialogUx = {};

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private accountService: AccountService,
    private userService: UserService,
    private uxService: UxService,
    private uploadService: UploadService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
  }

  save() {
    this.showLoader = true;
    this.uxService.updateLoadingState({ Loading: true, Message: 'Saving your information, please wait...' });
    if (this.company.CompanyId && this.company.CompanyId.length > 5) {
      this.companyService.update(this.company).subscribe(data => {
        setTimeout(() => {
          this.uxService.updateLoadingState({ Loading: false, Message: undefined });
          this.dialogUx.CtaLabel = 'Go To Dashboard';
          this.dialogUx.Message = 'Your information has been updated successfully';
          this.dialogUx.IsSuccess = true;
          this.dialogUx.CtaNav = '/dashboard';
          this.dialogUx.ShowDialog = true;
          this.dialogUx.IconUrl = 'assets/images/common/check.svg';
          this.uxService.updateDialogState(this.dialogUx);
        }, 1500);
      })
    } else {
      setTimeout(() => {
        this.companyService.add(this.company).subscribe(data => {
          if (data.CompanyId) {
            this.user.CompanyId = data.CompanyId;
            this.userService.updateUser(this.user);
            const user = this.accountService.currentUserValue;
            user.CompanyId =  data.CompanyId;
            this.accountService.updateUserState(user);
          }
          this.uxService.updateLoadingState({ Loading: false, Message: undefined });
          this.dialogUx.CtaLabel = 'Go To Dashboard';
          this.dialogUx.Message = 'Your information has been captured successfully';
          this.dialogUx.IsSuccess = true;
          this.dialogUx.CtaNav = '/dashboard';
          this.dialogUx.ShowDialog = true;
          this.dialogUx.IconUrl = 'assets/images/common/check.svg';
          this.uxService.updateDialogState(this.dialogUx);
        });
      }, 1500);
    }

  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }
    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, null, null, null, this.company, '1');
    });
  }

}
