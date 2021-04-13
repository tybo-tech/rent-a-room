import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Booking } from 'src/models/booking.model';
import { AccountService } from 'src/services';
import { BookingService } from 'src/services/booking.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[];
  user: User;

  constructor(
    private accountService: AccountService,
    private bookingService: BookingService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.bookings = this.bookingService.currentBookingListValue;
    this.user = this.accountService.currentUserValue;
    this.bookingService.getBookingsByUserIdSync(this.user.UserId).subscribe(data => {
      if (data) {
        this.bookings = data;
      }
    });
  }

  back() {
    this.router.navigate(['']);
  }

  cancel(){}
}
