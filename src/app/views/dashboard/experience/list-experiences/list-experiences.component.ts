import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Experience } from 'src/models/modal.experience';
import { AccountService } from 'src/services';
import { ExperienceService } from 'src/services/experience.service';

@Component({
  selector: 'app-list-experiences',
  templateUrl: './list-experiences.component.html',
  styleUrls: ['./list-experiences.component.scss']
})
export class ListExperiencesComponent implements OnInit {
  showAdd: boolean;
  newExperience: Experience;
  user: User;
  experiences: Experience[];

  constructor(
    private router: Router,
    private experienceService: ExperienceService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
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

  back(){
    this.router.navigate(['dashboard']);
  }
}
