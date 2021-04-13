import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { Booking } from 'src/models/booking.model';
import { TimeSlot } from 'src/models/time.model';
import { BookingService } from 'src/services/booking.service';
import { BookingItem } from 'src/models/booking.item.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  booking: Booking;
  selectedTime: TimeSlot;
  address;
  @Output() cartAction: EventEmitter<string> = new EventEmitter<string>();


  constructor(
    private bookingService: BookingService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.booking = this.bookingService.currentBookingValue;

    if (this.booking) {
    }
  }
  checkout() {
    alert('coming soom');
    return;
    if(!this.booking){
      return
    }
    if(!this.booking.Place && this.booking.IsCallout){
      alert('Please enter your address fro a callout')
      return
    }
    this.booking.Status = 'Pending Payment'
    if (this.booking.BookingItems.find(x => Number(x.ServicePrice) === 0)) {
      this.booking.Status = 'Charge at the salon'

    }
    this.booking.StartTime = '00';
    this.booking.FinishTime = '00';
    this.booking.TimeId = '00';
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
  back() {
    this.cartAction.emit('close');
    this.router.navigate(['']);
  }


  cancel() {
    this.bookingService.updateBookingState(null);
    this.back();
  }

  deleteItem(item: BookingItem, i) {
    this.booking.TotalAmount -= Number(item.ServicePrice);
    this.booking.BookingItems.splice(i, 1);
    this.bookingService.updateBookingState(this.booking);
  }
  callout(action) {
    this.booking.TotalAmount = this.getSum();
    if (action === 'add' && this.booking) {
      this.booking.IsCallout = true;
      this.booking.CallFee = 50;
      this.booking.TotalAmount += Number(this.booking.CallFee)
      this.bookingService.updateBookingState(this.booking);
      return;
    }
    this.booking.IsCallout = false;
    this.booking.CallFee = 0;
    this.bookingService.updateBookingState(this.booking);
    return
  }

  getSum() {
    let sum = 0;
    if (this.booking) {
      this.booking.BookingItems.forEach(x => {
        sum += Number(x.ServicePrice);
      })
    }
    return sum;
  }
  chnage(){
    this.bookingService.updateBookingState(this.booking);
  }
}
