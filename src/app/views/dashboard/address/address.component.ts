import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address, User } from 'src/models';
import { AccountService, CompanyService } from 'src/services';
import { AddressService } from 'src/services/address.service';
import { CUSTOMER, PARTNER } from 'src/shared/constants';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  address: Address;
  modalHeading: string;
  user: User;
  addressId: string;


  constructor(
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private companyService: CompanyService,
    private addressService: AddressService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.activatedRoute.params.subscribe(r => {
      this.addressId = r.id;
    });

    this.address = {
      AddressId: '',
      OtherId: '',
      AddressLine1: '',
      AddressLine2: '',
      AddressLine3: '',
      City: '',
      Province: '',
      PostalCode: '',
      CrateUserId: '',
      ModifyUserId: '',
      StatusId: '1'
    };



    if(this.addressId !== 'add') {
      this.addressService.getById(this.addressId).subscribe(data => {
        this.address = data;
      })
      this.modalHeading = 'Update Address';
    } else {
      if(this.user.UserType === PARTNER) {
        this.address.OtherId = this.user.CompanyId;
      } else if(this.user.UserType === CUSTOMER) {
        this.address.OtherId = this.user.UserId;
      }
      this.modalHeading = 'Please provide address details';
    }
  }
  back() {

  }
}
