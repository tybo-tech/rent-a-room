import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/models';
import { Images } from 'src/models/images.model';
import { Experience } from 'src/models/modal.experience';
import { MessageDialogUx } from 'src/models/UxModel.model';
import { AccountService } from 'src/services';
import { ExperienceService } from 'src/services/experience.service';
import { ImagesService } from 'src/services/images.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-add-experience',
  templateUrl: './add-experience.component.html',
  styleUrls: ['./add-experience.component.scss']
})
export class AddExperienceComponent implements OnInit {

  user: User;
  experiences: Experience[];
  experienceId: any;
  experience: Experience;
  dialogUx: MessageDialogUx = {};
  constructor(
    private router: Router,
    private experienceService: ExperienceService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private imagesService: ImagesService,
    private uxService: UxService,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.experienceId = r.id;
      this.getExperience();
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;

  }


  saveExperience() {
    this.experience.ExperienceSlug = this.experienceService.generateSlug(this.experience.Name, this.experience.Code, '');
  this.uxService.showLoader();
    this.experienceService.update(this.experience).subscribe(data => {
      if (data && data.ExperienceId) {
        setTimeout(() => {
          this.uxService.updateLoadingState({ Loading: false, Message: undefined });
          this.dialogUx.CtaLabel = 'Go to experience list';
          this.dialogUx.Message = 'Experience information has been saved successfully';
          this.dialogUx.IsSuccess = true;
          this.dialogUx.CtaNav ='dashboard/list-experiences';
          this.dialogUx.NavigateTo = 'dashboard/list-experiences';
          this.dialogUx.ShowDialog = true;
          this.dialogUx.IconUrl = 'assets/images/common/check.svg';
          this.uxService.updateDialogState(this.dialogUx);
          this.uxService.hideLoader();
        }, 0);
      }
    })
  }
  getExperience() {
    this.experienceService.getExperienceSync(this.experienceId).subscribe(data => {
      console.log('Experiences: ', data);
      this.experience = data;
    });;
  }

  deleteImage(image: Images) {
    if (image) {
      image.StatusId = 2;
      this.imagesService.update(image).subscribe(data => {
        if (data && data.ImageId) {
          this.experience.Images.splice(image.Index, 1);
          this.uxService.updateMessagePopState(`Image deleted.`);
        }

      })
    }
  }

  setMianImage(image: Images) {
    if (image) {
      const main = this.experience.Images.find(x => x.ImageId === image.ImageId);
      if (main) {
        this.experience.Images.map(x => x.IsMain = 0);
        main.IsMain = 1;
        this.imagesService.updateRange(this.experience.Images).subscribe(data => {
          if (data && data.ExperienceId && data.Images) {
            this.experience.Images = data.Images;
            this.experience.FeaturedImageUrl = main.Url;
            this.experience.Images.sort(function (a, b) {
              var textA = a.IsMain.toString();
              var textB = b.IsMain.toString();;
              return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
            });
            this.experienceService.updateExperienceState(this.experience);
            this.experienceService.update(this.experience).subscribe(data => {
              console.log(data);
            })
          }

        })
      }
    }
  }


  saveImage(image: Images) {
    if (image) {

      this.imagesService.add(image).subscribe(data => {
        if (data && data.ImageId) {
          if (!this.experience.Images) {
            this.experience.Images = [];
          }
          this.experience.Images.push(data);
          if (!this.experience.FeaturedImageUrl) {
            this.experience.FeaturedImageUrl = this.experience.Images[0].Url;
          }
          this.uxService.updateMessagePopState(`New Image uploaded.`);
          this.experienceService.updateExperienceState(this.experience);
        }

      })
    }
  }
  back() {
    this.router.navigate(['dashboard/list-experiences']);
  }

}
