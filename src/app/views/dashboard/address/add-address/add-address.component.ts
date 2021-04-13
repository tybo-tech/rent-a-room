import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address, User } from 'src/models';
import { MessageDialogUx } from 'src/models/UxModel.model';
import { AccountService, CompanyService, UploadService, UserService } from 'src/services';
import { AddressService } from 'src/services/address.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  @Input() address: Address;
  showLoader: boolean;
  user: User;
  dialogUx: MessageDialogUx = {};
  provinces: string[] = [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "Northern Cape",
    "North-West",
    "Western Cape",
  ]
  constructor(
    private companyService: CompanyService,
    private router: Router,
    private accountService: AccountService,
    private userService: UserService,
    private uxService: UxService,
    private uploadService: UploadService,
    private addressService: AddressService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
  }

  save() {
    this.showLoader = true;
    this.uxService.updateLoadingState({ Loading: true, Message: 'Saving your information, please wait...' });
    if (this.address.AddressId && this.address.AddressId.length > 5) {
      this.addressService.update(this.address).subscribe(data => {
        setTimeout(() => {
          this.uxService.updateLoadingState({ Loading: false, Message: undefined });
          this.dialogUx.CtaLabel = 'Go To Dashboard';
          this.dialogUx.Message = 'Your address is updated successfully';
          this.dialogUx.IsSuccess = true;
          this.dialogUx.CtaNav = '/dashboard';
          this.dialogUx.ShowDialog = true;
          this.dialogUx.IconUrl = 'assets/images/common/check.svg';
          this.uxService.updateDialogState(this.dialogUx);
        }, 1500);
      })
    } else {
      this.addressService.add(this.address).subscribe(data => {
        if(data) {
          setTimeout(() => {
            this.uxService.updateLoadingState({ Loading: false, Message: undefined });
            this.dialogUx.CtaLabel = 'Go To Dashboard';
            this.dialogUx.Message = 'Your information is captured successfully';
            this.dialogUx.IsSuccess = true;
            this.dialogUx.CtaNav = '/dashboard';
            this.dialogUx.ShowDialog = true;
            this.dialogUx.IconUrl = 'assets/images/common/check.svg';
            this.uxService.updateDialogState(this.dialogUx);
          }, 1500);
        }
      })
    }
  }

  valueChange(event){
    //this.selected = event.target.value;
  }

}
