import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User, CompanyVariation, Product } from 'src/models';
import { ProductCombination } from 'src/models/productcombination.model';
import { CompanyVariationService, AccountService, ProductService, UploadService } from 'src/services';
import { ProductCombinationService } from 'src/services/product-combination.service';
import { ProductVariationService } from 'src/services/product-variation.service';

@Component({
  selector: 'app-product-combinations',
  templateUrl: './product-combinations.component.html',
  styleUrls: ['./product-combinations.component.scss']
})
export class ProductCombinationsComponent implements OnInit {
  ProductId: any;
  user: User;
  product: Product;
  combinations: ProductCombination[] = [];
  showLoader;
  numberOfOptons: number;
  varationHeadings: any[];
  constructor(
    private router: Router,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private productCombinationService: ProductCombinationService,
    private uploadService: UploadService,
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
      this.combinations = [];
      if (product && product.ProductVariations) {
        this.numberOfOptons = product.ProductVariations.length;
        if (this.numberOfOptons === 1) {
          this.varationHeadings = [product.ProductVariations[0].VariationName];
          product.ProductVariations[0].ProductVariationOptions.forEach(option => {
            this.combinations.push(
              {
                ProductCombinationId: 0,
                CombinationString: option.OptionName,
                CombinationStringId: this.productCombinationService.generateCombinationStringId(option.OptionName),
                ProductId: this.product.ProductId,
                SKU: '',
                Price: 0,
                AvailabelStock: 0,
                CreateUserId: this.user.UserId,
                ModifyUserId: this.user.UserId,
                StatusId: 1
              }
            );
          });
        }
        if (this.numberOfOptons === 2) {
          this.varationHeadings = [`${product.ProductVariations[0].VariationName} & ${product.ProductVariations[1].VariationName}`];
          product.ProductVariations[0].ProductVariationOptions.forEach(option => {
            product.ProductVariations[1].ProductVariationOptions.forEach(optionLevel2 => {
              this.combinations.push(
                {
                  ProductCombinationId: 0,
                  CombinationString: `${option.OptionName} - ${optionLevel2.OptionName}`,
                  CombinationStringId: this.productCombinationService.generateCombinationStringId(`${option.OptionName} - ${optionLevel2.OptionName}`),
                  ProductId: this.product.ProductId,
                  SKU: '',
                  Price: this.product.RegularPrice,
                  AvailabelStock: 0,
                  CreateUserId: this.user.UserId,
                  ModifyUserId: this.user.UserId,
                  StatusId: 1
                }
              );
            });
          });
        }
        this.productCombinationService.addRange(this.combinations).subscribe(data => {
          this.combinations = data;
        });
      }
    });
  }

  back() {
    this.router.navigate([`/dashboard/products`]);
  }
  save() {
    console.log(this.combinations);
    let isSamePrice = true;
    const priceFrom = this.combinations[0].Price;
    const prices: number[] = [];
    this.combinations.forEach(comb => {
      if (Number(comb.Price) !== Number(priceFrom)) {
        isSamePrice = false;
      }
      prices.push(comb.Price);
    });
    // alert(isSamePrice);

    this.productCombinationService.updateRange(this.combinations).subscribe(data => {
      this.combinations = data;
      if (isSamePrice) {
        this.product.RegularPrice = this.combinations[0].Price;
        this.product.PriceFrom = 0;
        this.product.PriceTo = 0;
      } else {
        this.product.PriceFrom = Math.min.apply(Math, prices);
        this.product.PriceTo = Math.max.apply(Math, prices);
        this.product.RegularPrice = 0;
      }

      this.productService.update(this.product).subscribe(product => {
        this.product.PriceFrom = product.PriceFrom;
        this.product.PriceTo = product.PriceTo;
        this.product.RegularPrice = product.RegularPrice;
        this.productService.updateProductState(this.product);
      });
    });
  }

  public uploadFile = (files: FileList, index: number) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `otc.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.uploadService.uploadFile(formData).subscribe(url => {
        const uploadedImage = `${environment.API_URL}/api/upload/${url}`;
        this.combinations[index].FeaturedImage = uploadedImage;
        this.combinations.map(item => {
          if (!item.FeaturedImage) {
            item.FeaturedImage = '';
          }
          return item;
        });
        this.productCombinationService.updateRange(this.combinations).subscribe(data => {
          this.combinations = data;
        });
      });

    });




  }
  useRegulerPrice() {
    this.combinations.map(x => x.Price = this.product.RegularPrice);
    this.productCombinationService.updateRange(this.combinations).subscribe(data => {
      this.combinations = data;
    });
    this.product.RegularPrice = this.combinations[0].Price;
    this.productService.update(this.product).subscribe(product => {
      this.product.PriceFrom = product.PriceFrom;
      this.product.PriceTo = product.PriceTo;
      this.product.RegularPrice = product.RegularPrice;
      this.productService.updateProductState(this.product);
    });
  }
}
