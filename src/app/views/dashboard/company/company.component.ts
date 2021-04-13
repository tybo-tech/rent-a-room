import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company, User } from 'src/models';
import { AccountService, CompanyService, UserService } from 'src/services';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  company: Company;
  modalHeading: string;
  companyId: string;
  user: User;
  constructor(
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private companyService: CompanyService,
    private router: Router

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;
    });
    this.company = {
      CompanyId: '',
      Name: '',
      Description: '',
      CompanyType: '',
      Dp: '',
      BankAccHolder: '',
      BankAccNo: '',
      BankBranch: '',
      BankBranchCode: '',
      BankName: '',
      IsDeleted: '0',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: '1'
    }
    if (this.companyId !== 'add') {
      //TODO load company details
      this.companyService.getCompany(this.companyId).subscribe(data => {
         this.companyService.updateCompanyState(data);
        this.company = data;
      })
      this.modalHeading = 'Update Company';
    } else {
      this.modalHeading = 'Please provide company details';
    }
  }

  back() {
    this.router.navigate(['/dashboard']);
  }

}
