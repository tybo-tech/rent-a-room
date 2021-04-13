import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/models/product.model';
import { AccountService } from 'src/services/account.service';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  ProductId: string;
  showModal: boolean;
  modalHeading: string;
  product: Product;
  heading: string;
  selectedIndex: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private accountService: AccountService,
    private _snackBar: MatSnackBar

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.ProductId = r.id;
    });
  }

  ngOnInit() {
    // alert(this.ProductId)
    if (this.ProductId !== 'add') {
      this.product = this.productService.currentProductValue;
      this.productService.getProduct(this.ProductId);
      this.productService.productObservable.subscribe(product => {
        this.product = product;
        this.heading = ` Edit product | ${product.Name}`;
      });
    }

    if (this.ProductId === 'add') {
      this.product = {
        ProductId: undefined,
        CompanyId: '',
        Name: '',
        RegularPrice: 0,
        PriceFrom: 0,
        PriceTo: 0,
        Description: '',
        ProductSlug: '',
        CatergoryId: 0,
        ParentCategoryId: 0,
        CategoryName: '',
        ParentCategoryName: '',
        FeaturedImageUrl: '',
        IsJustInTime: '',
        Notes: '',
        ProductType: '',
        Code: '',
        CreateDate: '',
        CreateUserId: '',
        ModifyDate: '',
        ModifyUserId: '',
        StatusId: 1,
      };
      this.heading = `Adding new product`;
    }

  }

  back() {
    this.router.navigate([`/dashboard/products`]);
  }
  add() {
    this.showModal = true;
    this.modalHeading = `Add product options`;
  }
  closeModal() {
    this.showModal = false;
  }

  openSnackBar(message, heading) {
    this._snackBar.open(message, heading, {
      duration: 3000
    });

  }
  gottVariations() {
    this.router.navigate(['dashboard/product-variations', this.product.ProductSlug]);
  }
  saveAll() { }
  onTabChanged(event: MatTabChangeEvent) {
    console.log(event.index);
    this.selectedIndex = event.index;
  }
  addingProductFinished(product: Product) {
    if (product && product.ProductId) {
      this.productService.getProductSync(product.ProductId).subscribe(data => {
        if (data) {
          this.productService.updateProductState(data);
          if (this.ProductId === 'add') {
            this.ProductId = product.ProductSlug;
            this.router.navigate(['dashboard/product', product.ProductSlug]);
            this.selectedIndex = 1;
          }
        }
      });

    }
  }
}
