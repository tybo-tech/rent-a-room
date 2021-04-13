import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from 'src/models/booking.model';
import { BookingService } from 'src/services/booking.service';

@Component({
  selector: 'app-payment-cancelled',
  templateUrl: './payment-cancelled.component.html',
  styleUrls: ['./payment-cancelled.component.scss']
})
export class PaymentCancelledComponent implements OnInit {
  booking: Booking;
  bookingId: string;
  showDone: boolean;

  constructor(
    private bookingService: BookingService,
    private activatedRoute: ActivatedRoute,
    private router: Router,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.bookingId = r.id;
    });
  }

  ngOnInit() {
    this.bookingService.getBookingSync(this.bookingId).subscribe(data => {
      if (data && data.BookingId) {
        this.booking = data;
        this.booking.Status = 'Payment Cancelled'
        this.bookingService.update(this.booking).subscribe(updated => {
          this.booking = updated;
        });
      }
    })
  }



  back() {
    this.router.navigate(['']);
  }
  bookings() {
    this.router.navigate(['my-bookings']);
  }


}
