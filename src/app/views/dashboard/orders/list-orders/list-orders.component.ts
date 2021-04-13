import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from 'src/models/booking.model';
import { TimeSlot } from 'src/models/time.model';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services/account.service';
import { BookingService } from 'src/services/booking.service';


@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent implements OnInit {
  bookings: Booking[];
  user: User;
  times: TimeSlot[];

  constructor(
    private accountService: AccountService,
    private bookingService: BookingService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.bookings = this.bookingService.currentBookingListValue;
    this.user = this.accountService.currentUserValue;
    this.bookingService.getBookingsByUserIdSync('all').subscribe(data => {
      if (data) {
        this.bookings = data;
      }
    });

    this.bookingService.getTimeSlotListSync('zoweh').subscribe(data => {
      if (data && data.length) {
        this.times = data;
      }
    })
  }

  back() {
    this.router.navigate(['dashboard']);
  }

  update(booking: Booking) {
    this.bookingService.update(booking).subscribe(updated => {
      if (updated && updated.BookingId) {
        alert('Booking updated');
        if (updated.Status === 'Finished' || updated.Status === 'Cancelled') {
          if (this.times && this.times.length) {
            const time = this.times.find(x => x.TimeId === booking.TimeId);
            if (time) {
              this.updateTimeSlotCurrentCapacity(time, -1);
            }

          }
        }
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
}
