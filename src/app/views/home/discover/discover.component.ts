import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocaleProductsModel, Product, User } from 'src/models';
import { Experience } from 'src/models/modal.experience';
import { ProductService, AccountService } from 'src/services';
import { BookingService } from 'src/services/booking.service';
import { ExperienceService } from 'src/services/experience.service';
import { COMPANY } from 'src/shared/constants';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {

  @Input() categoryListing: LocaleProductsModel;
  products: Product[];
  user: User;
  modalHeading = 'Add product';
  showModal: boolean;
  showAddCustomer: boolean;
  allProducts: Product[];
  categories: any[];
  note = `The callout fee is R50.00 and is only available if you are in Empangeni.`;
  howto = `bring and collect your chothes at the following address.`;
  cat = 'saloon';
  isLoggedIn: boolean;
  experiences: Experience[];
  AddExperiences: Experience[];
  AllExperiences: Experience[];
  allExperiences: Experience[];
  constructor(
    private experienceService: ExperienceService,
    private accountService: AccountService,
    private bookingService: BookingService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.user.subscribe(data => {
      if (data) {
        this.user = data;
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    })
    this.getExperiences();
  }
  view(experience: Experience) {
    if (this.bookingService.currentBookingValue) {
      if (this.bookingService.currentBookingValue.BookingItems.find(x => x.ServiceId === experience.ExperienceId)) {
        alert(`product already booked`);
        return false;
      }
      this.experienceService.updateExperienceState(experience);
      this.router.navigate(['book', experience.ExperienceSlug]);
    } else {
      this.bookingService.updateBookingState({
        BookingId: '',
        UserId: '',
        BookingDate: undefined,
        StartTime: undefined,
        FinishTime: undefined,
        TimeId: undefined,
        Place: '',
        TotalAmount: 0,
        Status: 'Up coming',
        CreateUserId: '',
        ModifyUserId: '',
        StatusId: 1,
        BookingItems: []
      });
      this.experienceService.updateExperienceState(experience);
      this.router.navigate(['book', experience.ExperienceSlug]);
    }

  }

  getExperiences() {
    // if(this.user) {
    this.experienceService.getAllActiveExperiences();
    this.experienceService.experienceListObservable.subscribe(data => {
      console.log('Experiences: ', data);
      this.allExperiences = data;
      this.experiences = this.allExperiences.filter(x => x.ParentCategoryName === 'Adventure');
    });
    // }
  }

  selectCategory(index) {

    const tempCategories = [];
    this.categories.forEach((category, index) => {
      console.log(`${category.CategoryName} ${index}`);
      if (category.CategoryName && !tempCategories.find(x => x.CategoryName === category.CategoryName)) {
        tempCategories.push(category);
      }
    });

    this.categories = tempCategories;

    this.categories.map(x => x.Class = []);
    this.categories[index].Class.push('active');
    this.products = this.allProducts.filter(x => x.CategoryName === this.categories[index].CategoryName);
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }

  tab(cat: string) {
    this.experiences = this.allExperiences.filter(x => x.ParentCategoryName === cat);
  }

}
