import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'src/models/product.model';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services/account.service';
import { ProductService } from 'src/services/product.service';
import { UserService } from 'src/services/user.service';
import { COMPANY } from 'src/shared/constants';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  user: User;
  modalHeading = 'Add product';
  showModal: boolean;
  showAddCustomer: boolean;
  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.products$ = this.productService.productListObservable;
    this.productService.getProducts(COMPANY);
  }
  view(product: Product) {
    this.productService.updateProductState(product);
    this.router.navigate(['dashboard/product', product.ProductSlug]);
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }
  add(){
    // this.router.navigate(['dashboard/add-product']);
    this.productService.updateProductState(null);
    this.router.navigate(['dashboard/product', 'add']);
  }
  back(){
    this.router.navigate(['dashboard']);
  }

}
