import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Booking } from 'src/models/booking.model';
import { TimeSlot } from 'src/models/time.model';
import { AccountService } from 'src/services';
import { BookingService } from 'src/services/booking.service';

@Component({
  selector: 'app-list-timeslot',
  templateUrl: './list-timeslot.component.html',
  styleUrls: ['./list-timeslot.component.scss']
})
export class ListTimeslotComponent implements OnInit {

  user: User;
  times: TimeSlot[];

  constructor(
    private accountService: AccountService,
    private bookingService: BookingService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.bookingService.getTimeSlotListSync('zoweh').subscribe(data => {
      if (data && data.length) {
        this.times = data;
      }
    })
  }

  back() {
    this.router.navigate(['']);
  }
  update(time: TimeSlot) {
    if (time && time.TimeSlotId) {
      this.bookingService.updateTimeSlotListSync(time).subscribe(data => {
        if (data && data.TimeSlotId) {
          alert('Time slot updated');
        }
      });
    }
  }
}
