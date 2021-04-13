import { LocaleDataService, ProductService } from 'src/services';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { LocaleProduct, Product } from 'src/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-section-detail',
  templateUrl: './product-section-detail.component.html',
  styleUrls: ['./product-section-detail.component.scss']
})
export class ProductSectionDetailComponent implements OnInit, OnChanges {
  product: LocaleProduct;
  productSlug: string;
  totalPrice = 0;
  quantity = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private localeDataService: LocaleDataService
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.productSlug = r.id;
    });
  }

  ngOnInit() {
    this.product = this.localeDataService.getLocaleStorageProduct;
    this.updateTotalPrice(this.product.Quantity);
  }

  ngOnChanges() {
    alert()
    this.updateTotalPrice(this.quantity);
  }
  updateTotalPrice(quantity) {
    if (!quantity) {
      quantity = 1;
    }
    this.quantity = quantity;
    this.totalPrice = this.product.UnitPrice * quantity;
  }

}
