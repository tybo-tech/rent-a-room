import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocaleProductsModel, Product, User } from 'src/models';
import { AccountService, LocaleDataService, ProductService } from 'src/services';
import { BookingService } from 'src/services/booking.service';
import { COMPANY } from 'src/shared/constants';

@Component({
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.scss']
})
export class ProductSectionComponent implements OnInit {
  @Input() categoryListing: LocaleProductsModel;
  products: Product[];
  user: User;
  modalHeading = 'Add product';
  showModal: boolean;
  showAddCustomer: boolean;
  allProducts: Product[];
  categories: any[];
  note = `The callout fee is R50.00 and is only available if you are in Empangeni.`;
  howto = `bring and collect your chothes at the following address.`;
  cat = 'saloon';
  isLoggedIn: boolean;
  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private bookingService: BookingService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.user.subscribe(data=>{
      if(data){
        this.user = data;
        this.isLoggedIn = true;
      }else{
        this.isLoggedIn = false;
      }
    })
    this.productService.productListObservable.subscribe(data => {
      this.allProducts = data;
      this.products = this.allProducts.filter(x => x.ParentCategoryName === 'Saloon');
      this.categories = this.products.map(x => {
        return {
          CategoryName: x.CategoryName,
          Class: []
        };
      });

      if (this.categories && this.categories.length) {
        this.selectCategory(0);
      }
    });
    this.productService.getProducts(COMPANY);
  }
  view(product: Product) {
    if (this.bookingService.currentBookingValue) {
      if (this.bookingService.currentBookingValue.BookingItems.find(x => x.ServiceId === product.ProductId)) {
        alert(`product already booked`);
        return false;
      }
      this.productService.updateProductState(product);
      this.router.navigate(['book', product.ProductSlug]);
    } else {
      this.bookingService.updateBookingState({
        BookingId: '',
        UserId: '',
        BookingDate: undefined,
        StartTime: undefined,
        FinishTime: undefined,
        TimeId: undefined,
        Place: ' ',
        TotalAmount: 0,
        Status: 'Up coming',
        CreateUserId: '',
        ModifyUserId: '',
        StatusId: 1,
        BookingItems: []
      });
      this.productService.updateProductState(product);
      this.router.navigate(['book', product.ProductSlug]);
    }

  }

  selectCategory(index) {
  
    const tempCategories = [];
    this.categories.forEach((category, index) => {
      console.log(`${category.CategoryName} ${index}`);
      if (category.CategoryName && !tempCategories.find(x => x.CategoryName === category.CategoryName)) {
        tempCategories.push(category);
      }
    });

    this.categories = tempCategories;

    this.categories.map(x => x.Class = []);
    this.categories[index].Class.push('active');
    this.products = this.allProducts.filter(x => x.CategoryName === this.categories[index].CategoryName);
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }

  tab(cat: string) {
    this.cat = cat;
    if (cat === 'carwash') {
      cat = 'Car wash';
      this.note = `Car wash callout service is comming soon across Empangeni.`;

    }
    if (cat === 'laundry') {
      cat = 'Laundry';
      this.note = `Laundry’s pick up and delivery service is comming soon across Empangeni.`;

    }
    if (cat === 'shopping') {
      cat = 'Shopping';
      this.note = `Shopping is comming soon.`;
    }
    if (cat === 'saloon') {
      cat = 'Saloon';
      this.note = `The callout fee is R50.00 and is only available if you are in Empangeni`;
    }
    this.products = this.allProducts.filter(x => x.ParentCategoryName === cat);
  }
}
