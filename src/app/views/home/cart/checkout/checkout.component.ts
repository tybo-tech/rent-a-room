import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User, Order } from 'src/models';
import { Booking } from 'src/models/booking.model';
import { AccountService, OrderService } from 'src/services';
import { BookingService } from 'src/services/booking.service';
import { COMPANY } from 'src/shared/constants';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {


  user: User;
  isGuest: boolean;
  companyId: string;
  productName = '';
  productDescription = '';
  merchantId = '16913063';
  merchantKey = 'nq9dlw653v712';
  shopingSuccesfulUrl: string;
  paymentCallbackUrl: string;
  paymentCancelledUrl: string;
  booking: Booking;

  constructor(
    private accountService: AccountService,
    // private shoppingService: ShoppingService,
    private router: Router,
    private bookingService: BookingService,

  ) {

  }
  ngOnInit(): void {
    this.user = this.accountService.currentUserValue;
    this.booking = this.bookingService.currentBookingValue;

    if (!this.booking) {
      alert('No booking data');
      this.back();
    }
    this.companyId = COMPANY;
    this.shopingSuccesfulUrl = `${environment.BASE_URL}/#/shoping-succesful/${this.booking.BookingId}`;
    this.paymentCancelledUrl = `${environment.BASE_URL}/#/payment-cancelled/${this.booking.BookingId}`;
    this.paymentCallbackUrl = `${environment.BASE_URL}/payment-callback`;
    this.productName = this.booking.BookingItems.map(x => x.ServiceName).toString();
    this.productDescription = this.productName;
    if (this.productName.length > 100) {
      this.productName = this.productName.substring(0, 99);
    }
    if (this.productDescription.length > 255) {
      this.productDescription = this.productDescription.substring(0, 254);
    }
  }
  contineuAsGuest() {
    this.isGuest = true;
  }

  back() {
    this.router.navigate(['']);
  }
  payments() {
    this.router.navigate(['at', this.companyId]);
  }

  payAtSalon() {
    this.booking.Status = 'Pay at salon'
    this.bookingService.update(this.booking).subscribe(updated => {
      this.booking = updated;
      this.bookingService.updateBookingState(null);
      this.router.navigate(['my-bookings']);
    });
  }

}
