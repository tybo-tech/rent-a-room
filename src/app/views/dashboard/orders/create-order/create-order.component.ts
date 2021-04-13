import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from 'src/models/order.model';
import { Orderproduct } from 'src/models/order.product.model';
import { Product } from 'src/models/product.model';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services/account.service';
import { OrderService } from 'src/services/order.service';
import { ProductService } from 'src/services/product.service';
import { UserService } from 'src/services/user.service';
import { CUSTOMER, COMPANY } from 'src/shared/constants';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
  user: User;
  users: User[];
  customerId: string;
  showLoader;
  products: Product[];
  productNameSearch: string;
  notes = '';
  orderFor: string;
  Quantity = 1;
  Price;
  Total = 0;
  productsToChooseFrom: Product[];
  modalHeading: string;
  showChooseProduct: boolean;
  lineItems: Orderproduct[];
  currentItemIndex: number;
  showChooseCustomer: boolean;
  customer: User;
  customerName = '';
  orderNo;
  invoiceDate = new Date();
  invoiceDueDate;
  orders: Order[];
  chooseCustomerLabel = 'Choose existing customer';
  constructor(
    private router: Router,
    private accountService: AccountService,
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.orderService.OrderListObservable.subscribe(data => {
      this.orders = data;
      this.orderNo = `INV00${this.orders.length + 1}`;
    });
    this.orderService.getOrders(COMPANY);
    this.userService.userListObservable.subscribe(data => {
      this.users = data;
    });
    this.userService.getUsers(COMPANY, 'Customer');

    this.productService.productListObservable.subscribe(data => {
      if (data) {
        this.products = data;
        // this.chooseProduct(0);
      }
    });
    this.productService.getProducts(COMPANY);
    this.lineItems = this.loadInintOrderproducts();
  }

  back() {
    this.router.navigate([`/dashboard/invoices`]);
  }
  customerChanged(customer: User) {
    console.log(customer);
    this.customerId = customer.UserId;
    this.orderFor = `for ${customer.Name}`;

  }
  add() { }

  calculateTotal(orderproduct: Orderproduct) {
    orderproduct.SubTotal = Number(orderproduct.UnitPrice) *
      Number(orderproduct.Quantity);
    this.calculateTotalOverdue();
  }
  calculateTotalOverdue() {
    this.Total = 0;
    this.lineItems.forEach(line => {
      this.Total += Number(line.SubTotal);
    });

  }
  chooseProduct(i: number) {
    this.productsToChooseFrom = this.products;
    this.modalHeading = 'Choose product for an invoice';
    this.showChooseProduct = true;
    this.currentItemIndex = i;
  }
  itemSelected(item: any) {
    if (item.ProductId) {
      const product: Product = item;
      this.lineItems[this.currentItemIndex] = this.mapOrderproduct(product);
      this.calculateTotalOverdue();
    }
    if (item.UserId) {
      this.customer = item;
      this.calculateTotalOverdue();
      this.customerName = this.customer.Name;
      this.chooseCustomerLabel = 'Change customer';
    }
    this.closeModal();

  }


  closeModal() {
    this.showChooseProduct = false;
    this.showChooseCustomer = false;
  }

  loadInintOrderproducts(): Orderproduct[] {
    return [
      {
        Id: '',
        OrderId: '',
        ProductId: '',
        CompanyId: '',
        ProductName: '',
        UnitPrice: 0,
        Quantity: 0,
        SubTotal: 0,
        CreateUserId: '',
        ModifyUserId: '',
        StatusId: 1
      },
      {
        Id: '',
        OrderId: '',
        ProductId: '',
        CompanyId: '',
        ProductName: '',
        UnitPrice: 0,
        Quantity: 0,
        SubTotal: 0,
        CreateUserId: '',
        ModifyUserId: '',
        StatusId: 1
      }
    ];
  }

  mapOrderproduct(product: Product): Orderproduct {
    return {
      Id: '',
      OrderId: '',
      ProductId: product.ProductId,
      CompanyId: COMPANY,
      ProductName: product.Name,
      UnitPrice: product.RegularPrice,
      Quantity: 1,
      SubTotal: product.StatusId,
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    };
  }

  addLine() {
    this.lineItems.push({
      Id: '',
      OrderId: '',
      ProductId: '',
      CompanyId: '',
      ProductName: '',
      UnitPrice: 0,
      Quantity: 0,
      SubTotal: 0,
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    });
  }

  removeLine(index: number) {
    this.lineItems.splice(index, 1);
    this.calculateTotalOverdue();

  }
  chooseCustomer() {
    this.showChooseCustomer = true;

  }
  saveInvoice() {
    const order: Order = {
      OrdersId: '',
      OrderNo: this.orderNo,
      CompanyId: COMPANY,
      CustomerId: this.customer && this.customer.UserId || '',
      AddressId: '',
      Notes: this.notes,
      OrderType: 'Sales',
      Total: this.Total,
      Paid: 0,
      Due: this.Total,
      InvoiceDate: this.invoiceDate,
      DueDate: this.invoiceDueDate || '',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      Status: 'Not paid',
      StatusId: 1,
      Orderproducts: this.lineItems.filter(x => x.ProductId.length > 5)
    };
    console.log(order);
    this.orderService.create(order).subscribe(data => {
      if (data && data.OrdersId) {
        this.orderService.updateOrderState(data);
        this.router.navigate(['dashboard/order', data.OrdersId]);
      }
    });

  }

}

