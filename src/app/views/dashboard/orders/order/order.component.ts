import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/models/order.model';
import { AccountService } from 'src/services/account.service';
import { OrderService } from 'src/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  OrderId: string;
  showModal: boolean;
  modalHeading: string;
  order: Order;
  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    private accountService: AccountService,
    private snackBar: MatSnackBar

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.OrderId = r.id;
    });
  }

  ngOnInit() {
    this.order = this.orderService.currentOrderValue;
    this.orderService.getOrder(this.OrderId);
    this.orderService.OrderObservable.subscribe(order => {
      this.order = order;
    });
  }

  back() {
    this.router.navigate([`/dashboard/invoices`]);
  }
  add() {
    this.showModal = true;
    this.modalHeading = `Add Order options`;
  }
  closeModal() {
    this.showModal = false;
  }

  openSnackBar(message, heading) {
    const snackBarRef = this.snackBar.open(message, heading, {
      duration: 3000
    });
    console.log(snackBarRef);


  }
  saveAll() { }
  print(){
    this.orderService.print(this.order).subscribe(data=>{
      console.log(data);
    });
  }
}
