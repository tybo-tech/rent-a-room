import { Component, EventEmitter, OnInit } from '@angular/core';
import { LocaleProductsModel, Product } from 'src/models';
import { LocaleDataService } from 'src/services';

@Component({
  selector: 'app-home-landing',
  templateUrl: './home-landing.component.html',
  styleUrls: ['./home-landing.component.scss']
})
export class HomeLandingComponent implements OnInit {
  localeProducts: LocaleProductsModel[] = [];
  categoryListing: LocaleProductsModel;
  currentNav: string;
  constructor(
    private localeDataService: LocaleDataService
  ) { }

  ngOnInit() {
    this.localeDataService.getLocaleProducts().subscribe(data => {
      this.localeProducts = data;
      this.displayProducts('Women');
    });
  }
  onNavItemClicked($event) {
    this.displayProducts($event);
  }

  displayProducts(categoryName: string) {
    const selectedCategory = this.localeProducts.find(x => x.ParentCategoryName === categoryName);
    this.categoryListing = selectedCategory;
  }

}
