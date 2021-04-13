import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, CompanyVariation, VariationOption, Product } from 'src/models';
import { ProductVariation } from 'src/models/product.variation.model';
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { CompanyVariationService, AccountService, ProductService } from 'src/services';
import { ProductVariationService } from 'src/services/product-variation.service';
import { COMPANY } from 'src/shared/constants';

@Component({
  selector: 'app-product-variations',
  templateUrl: './product-variations.component.html',
  styleUrls: ['./product-variations.component.scss']
})
export class ProductVariationsComponent implements OnInit {
  showLoader;
  user: User;
  varaitions: CompanyVariation[];
  variationsOptions: VariationOption[];
  test;
  product: Product;
  ProductId: any;
  constructor(
    private companyVariationService: CompanyVariationService,
    private router: Router,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private productVariationService: ProductVariationService,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.ProductId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.product = this.productService.currentProductValue;
    this.productService.getProduct(this.ProductId);
    this.productService.productObservable.subscribe(product => {
      this.product = product;
    });

    this.companyVariationService.getCompanyVariations(COMPANY);
    this.companyVariationService.companyVariationListObservable.subscribe(data => {
      if (data && data.length) {
        data.forEach(varaition => {
          if (varaition.VariationsOptions) {
            varaition.VariationsOptions.forEach(option => {
              if (this.product.ProductVariations) {
                const existingProductVariation =
                  this.product.ProductVariations.find(x => x.CompanyVariationId === varaition.CompanyVariationId);
                console.log('existingProductVariation', existingProductVariation);
                if (
                  existingProductVariation &&
                  existingProductVariation.ProductVariationOptions
                    .find(x => x.CompanyVariationOptionId === option.Id)
                ) {
                  option.IsSelected = true;
                }

              }


              // alert(option.Name);
            });
          }
        });
      }
      this.varaitions = data || [];
    });

  }

  back() {
    this.router.navigate([`/dashboard/products`]);
  }

  selectVariation(variation: VariationOption) {
    if (variation) {
      variation.IsSelected = !variation.IsSelected;
      return true;
    }
  }
  saveProduct() {
    console.log(this.varaitions);
    const productVariations: ProductVariation[] = [];
    const productVariationOptions: ProductVariationOption[] = [];
    this.varaitions.forEach(varaition => {
      if (varaition.VariationsOptions && varaition.VariationsOptions.find(x => x.IsSelected)) {
        productVariations.push({
          ProductId: this.product.ProductId,
          CompanyVariationId: varaition.CompanyVariationId,
          VariationName: varaition.Name,
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          StatusId: 1
        });
      }
      varaition.VariationsOptions.forEach(option => {
        if (option.IsSelected) {
          productVariationOptions.push({
            ProductVariationId: 0,
            CompanyVariationId: varaition.CompanyVariationId,
            CompanyVariationOptionId: option.Id,
            VariationName: varaition.Name,
            OptionName: option.Name,
            CreateUserId: this.user.UserId,
            ModifyUserId: this.user.UserId,
            StatusId: 1
          });
        }
      });
    });
    if (!productVariations.length) {
      alert('Please at least one product variations to continue');
      return false;
    }
    this.productVariationService.addProductVariationRange(productVariations).subscribe(data => {
      if (data && data.length) {
        productVariationOptions.map(item => {
          item.ProductVariationId = data.find(x => x.CompanyVariationId === item.CompanyVariationId).Id;
          return item;
        });
        this.productVariationService.addProductVariationOptionsRange(productVariationOptions).subscribe(res => {
          this.productService.getProductSync(this.product.ProductId).subscribe(response => {
            if (data) {
              this.productService.updateProductState(response);
            }
          });
        });
      }
    });
  }
}
