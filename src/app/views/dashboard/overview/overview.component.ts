import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address, Company } from 'src/models';
import { Experience } from 'src/models/modal.experience';
import { User } from 'src/models/user.model';
import { CompanyService } from 'src/services';
import { AccountService } from 'src/services/account.service';
import { AddressService } from 'src/services/address.service';
import { ExperienceService } from 'src/services/experience.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  user: User;
  company: Company;
  addressList: Address[] = [];
  experiences: Experience[];
  newExperience: Experience;
  showAdd: boolean;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private addressService: AddressService,
    private companyService: CompanyService,
    private experienceService: ExperienceService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.companyService.getCompany(this.user.CompanyId).subscribe(data => {
      if (!data) {
        this.router.navigate(['dashboard/company/add']);
      }
      this.companyService.updateCompanyState(data);
      if (data) {
        this.company = data;
        this.addressService.getByOtherId(this.company.CompanyId).subscribe(data => {
          if (data) {
            this.addressList = data;
          }
          if (this.company.BankAccNo === null || this.addressList.length === 0) {
            this.router.navigate(['dashboard/overview']);
          }
        });
      }

    });

    this.getExperiences();
  }


  add() {
    this.showAdd = true;
    this.newExperience = {
      ExperienceId: "",
      CompanyId: this.user.CompanyId,
      Name: "",
      RegularPrice: 0,
      PriceFrom: "",
      PriceTo: "",
      Description: "",
      Code: "",
      CatergoryId: "",
      ParentCategoryId: "",
      CategoryName: "",
      ParentCategoryName: "",
      ParentCategoryGuid: "",
      CategoryGuid: "",
      ExperienceSlug: "",
      FeaturedImageUrl: "",
      Notes: "",
      ExperienceType: "",
      CreateDate: "",
      CreateUserId: this.user.UserId,
      ModifyDate: "",
      ModifyUserId: this.user.UserId,
      StatusId: 1
    }
    this.newExperience.Code =
      this.newExperience.Code = `E00${this.experiences.length + 1}`;
  }


  saveExperience() {
    this.newExperience.ExperienceSlug = this.experienceService.generateSlug(this.newExperience.Name, this.newExperience.Code, '');
    this.experienceService.add(this.newExperience).subscribe(data => {
      if (data && data.ExperienceId) {
        this.gotoExperiences(data)
      }
    })
  }

  getExperiences() {
    this.experienceService.getExperiences(this.user.CompanyId);
    this.experienceService.experienceListObservable.subscribe(data => {
      console.log('Experiences: ', data);
      this.experiences = data;
    });
  }

  gotoExperiences(experience: Experience) {
    this.router.navigate([`dashboard/add-experience`, experience.ExperienceSlug]);
  }

  back() {
    this.router.navigate(['']);
  }

  toProfile(url) {
    this.router.navigate([`${url}`]);
  }
  goto(url) {
    this.router.navigate([`dashboard/${url}`]);
  }


  logout() {
    this.user = null;
    this.accountService.updateUserState(null);
    this.router.navigate(['']);
  }
  toCompany() {
    if (this.company) {
      this.router.navigate(['dashboard/company', this.company.CompanyId]);
    } else {
      this.router.navigate(['dashboard/company/add']);
    }
  }
}
