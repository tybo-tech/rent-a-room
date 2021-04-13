import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocaleProduct, Product } from 'src/models';
import { LocaleDataService } from 'src/services';

@Component({
  selector: 'app-product-section-card',
  templateUrl: './product-section-card.component.html',
  styleUrls: ['./product-section-card.component.scss']
})
export class ProductSectionCardComponent implements OnInit {
  @Input() product: LocaleProduct;
  @Input() categoryName?: string;
  constructor(
    private localeDataService: LocaleDataService,
    private router: Router
  ) { }

  ngOnInit(
  ) {
  }

  viewMore(model: LocaleProduct) {
    this.localeDataService.updateLocaleProductState(model);
    this.router.navigate(['/product-details', model.ProductSlug]);
  }

}
