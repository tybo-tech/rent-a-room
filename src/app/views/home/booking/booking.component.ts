import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { strict } from 'assert';
import { Product, User } from 'src/models';
import { BookingItem } from 'src/models/booking.item.model';
import { Booking } from 'src/models/booking.model';
import { Images } from 'src/models/images.model';
import { Experience } from 'src/models/modal.experience';
import { TimeSlot } from 'src/models/time.model';
import { AccountService } from 'src/services';
import { BookingService } from 'src/services/booking.service';
import { ExperienceService } from 'src/services/experience.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  experience: Experience;
  productSlug: string;
  totalPrice = 0;
  quantity = 0;
  showModal: boolean;
  modalHeading: string;
  orderProducts: Product[];
  booking: Booking;
  bookingItem: BookingItem;
  times: TimeSlot[];
  user: User;
  showBookingDateTime: boolean;
  showSuccess: boolean;
  showDone: boolean;
  selectedTime: TimeSlot;
  showNoCharge: boolean;
  experienceId: any;
  showTravellers: boolean;
  Travellers: string;
  TravellersLabelTotal: string;
  maxOptions = [];
  totalTravellers: number = 2;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    private experienceService: ExperienceService,
    private router: Router,


  ) {
    this.activatedRoute.params.subscribe(r => {
      this.experienceId = r.id;
      this.getExperience();
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;


    this.bookingService.getTimeSlotListSync('zoweh').subscribe(data => {
      if (data && data.length) {
        this.times = data;
        this.times = this.times.filter(x => Number(x.StatusId) === 1 && Number(x.MaxCapacity) > Number(x.CurrentCapacity));
      }
    })
    for (let i = 0; i <= 15; i++) {
      this.maxOptions.push(i);
    }
  }


  getExperience() {
    this.experienceService.getExperienceSync(this.experienceId).subscribe(data => {
      console.log('Experiences: ', data);
      this.experience = data;
      this.booking = this.bookingService.currentBookingValue;

      if (this.booking && this.experience) {
        this.bookingItem = {
          BookingItemId: '',
          BookingId: this.booking.BookingId,
          ServiceId: this.experience.ExperienceId,
          ServiceName: this.experience.Name,
          ServicePrice: this.experience.RegularPrice,
          ServiceQuantity: 1,
          Infants: 0,
          Children: 0,
          Adults: 2,
          ServiceTotal: this.experience.RegularPrice,
          FeaturedImageUrl: this.experience.FeaturedImageUrl,
          Status: 'Up coming',
          CreateUserId: '',
          ModifyUserId: '',
          StatusId: 1,
        };

        this.TravellersLabelTotal = '2 Adults'

        if (!this.booking.TimeId) {
          this.showBookingDateTime = true;
        }


      }
    });;
  }

  ngOnChanges() {
    this.updateTotalPrice(this.quantity);
  }
  updateTotalPrice(quantity) {
    if (!quantity) {
      quantity = 1;
    }
    this.quantity = quantity;
    this.totalPrice = this.experience.RegularPrice * quantity;
  }


  closeModal() {
    this.showModal = false;
  }
  continueShopping() {
    this.router.navigate(['']);
  }

  onNavItemClicked(event) { }
  selectColor(option) {
    console.log(option);
  }



  selectTime(item: TimeSlot) {
    this.times.map(x => x.Class = []);
    item.Class = ['active'];
    this.booking.StartTime = item.StartTime;
    this.booking.FinishTime = item.FinishTime;
    this.booking.TimeId = item.TimeId;
    this.selectedTime = item;
  }
  book() {
    if (!this.user) {
      this.showModal = true;
      this.modalHeading = 'Please enter your details';
      return;
    }
    this.booking.UserId = this.user.UserId;
    this.booking.CreateUserId = this.user.UserId;
    this.booking.ModifyUserId = this.user.UserId;
    this.bookingService.updateBookingState(this.booking);
    this.addToCart();

  }

  userLoggedInDone(user: User) {
    if (user && user.UserId) {
      this.showModal = false;
      this.user = user;
      this.book();
    }
  }
  back() {
    this.router.navigate(['']);
  }
  bookings() {
    this.router.navigate(['my-bookings']);
  }

  addToCart() {
    if (!this.user) {
      this.showModal = true;
      this.modalHeading = 'Please enter your details';
      return;
    }

    if (this.experience && this.booking) {

      this.bookingItem.ServiceQuantity = this.totalTravellers;
      this.bookingItem.ServiceQuantity = this.totalTravellers;
      this.booking.BookingItems.push(this.bookingItem);
      this.booking.TotalAmount += Number(this.bookingItem.ServicePrice) * Number(this.bookingItem.ServiceQuantity);
      this.bookingService.updateBookingState(this.booking);
      this.experience.IsBooked = true;
      this.experienceService.updateExperienceState(this.experience);
      this.router.navigate(['my-cart']);
    }
  }

  toggleShowNoCharge() {
    this.showNoCharge = false;
  }


  deleteItem(item: BookingItem, i) {
    this.booking.TotalAmount -= Number(item.ServicePrice);
    this.booking.BookingItems.splice(i, 1);
    this.bookingService.updateBookingState(this.booking);

  }

  cancel() {
    this.bookingService.updateBookingState(null);
    this.back();
  }


  checkout() {
    this.booking.Status = 'Pending Payment'
    if (this.booking.BookingItems.find(x => Number(x.ServicePrice) === 0)) {
      this.booking.Status = 'Charge at the salon'

    }

    this.booking.StartTime = '00';
    this.booking.FinishTime = '00';
    this.booking.TimeId = '00';
    debugger
    this.bookingService.add(this.booking).subscribe(data => {
      if (data && data.BookingId) {
        this.updateTimeSlotCurrentCapacity(this.selectedTime, 1);
        this.booking.BookingId = data.BookingId;

        if (data.Status === 'Charge at the salon') {
          this.bookingService.updateBookingState(null);
          this.router.navigate(['my-bookings']);
        } else {
          this.bookingService.updateBookingState(this.booking);
          this.router.navigate(['checkout']);
        }
        // this.showDone = true;
        // this.showBookingDateTime = false;
      }
    });
  }

  updateTimeSlotCurrentCapacity(time: TimeSlot, i) {
    if (time && time.TimeSlotId) {
      time.CurrentCapacity = Number(time.CurrentCapacity) + i;
      this.bookingService.updateTimeSlotListSync(time).subscribe(data => {
        if (data && data.TimeSlotId) {
        }
      });
    }
  }
  showSuccessFalse() {
    this.showSuccess = false;
  }

  chooseTravellers() {
    this.showTravellers = true;
  }

  doneSelectingTravellers() {
    this.showTravellers = true;
  }
  caculateTravellers() {
    const travellers =
      Number(this.bookingItem.Infants)
      + Number(this.bookingItem.Children)
      + Number(this.bookingItem.Adults);
    if (this.bookingItem.Infants === 0 && this.bookingItem.Children === 0) {
      this.TravellersLabelTotal = `${travellers} Adults`;
    } else {
      this.TravellersLabelTotal = `${travellers} Travellers`;
    }
    this.totalTravellers = travellers;
  }

  handleSwipe(direction) {
    alert(direction)

  }

  selectImage(image: Images) {
    this.experience.FeaturedImageUrl = image.Url;
  }
}
