import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address, Company, User } from 'src/models';
import { AccountService, CompanyService } from 'src/services';
import { AddressService } from 'src/services/address.service';

@Component({
  selector: 'app-company-overview',
  templateUrl: './company-overview.component.html',
  styleUrls: ['./company-overview.component.scss']
})
export class CompanyOverviewComponent implements OnInit {
 user: User;
  company: Company;
  addressList: Address[] = [];
  constructor(
    private accountService: AccountService,
    private router: Router,
    private addressService: AddressService,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.companyService.getCompany(this.user.CompanyId).subscribe(data => {
      this.companyService.updateCompanyState(data);
      this.company = data;
      this.addressService.getByOtherId(this.company.CompanyId).subscribe(data => {
        if(data) {
          this.addressList = data;
        }
      });
    });
  }
  back() {
    this.router.navigate(['/dashboard']);
  }

  view(company: Company) {
    this.router.navigate(['/dashboard/company', company.CompanyId]);
  }
  toAddress() {
    this.router.navigate(['/dashboard/address', 'add']);
  }
}
