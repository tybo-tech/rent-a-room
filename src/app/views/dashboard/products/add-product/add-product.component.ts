import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Category, CompanyCategory, Product, User } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { AccountService, CompanyCategoryService, ProductService, UploadService } from 'src/services';
import { COMPANY } from 'src/shared/constants';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  showLoader;
  @Input() existingProduct: Product;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() addingProductFinished: EventEmitter<Product> = new EventEmitter();

  product: Product = {
    ProductId: '',
    CompanyId: '',
    Name: '',
    RegularPrice: 0,
    PriceFrom: 0,
    PriceTo: 0,
    Description: '',
    ProductSlug: '',
    CatergoryId: 0,
    ParentCategoryId: 0,
    CategoryName: 'Show to customer',
    ParentCategoryName: 'Laundry',
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

  editorStyle = {
    height: '180px',
    marginBottom: '30px',
  };
  user: User;
  parentCategories: CompanyCategory[];
  chilndrenCategories: CompanyCategory[];
  categories: CompanyCategory[];


  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      // ['image']
    ]
  };


  modalModel: ModalModel = {
    heading: 'Welcome to TyboFashion',
    body: [],
    ctaLabel: 'Setup categories',
    routeTo: 'dashboard/set-up-company-categories',
    img: ''
  };
  showModal: boolean;
  constructor(
    private router: Router,
    private productService: ProductService,
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private uploadService: UploadService,
    private snackBar: MatSnackBar



  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.existingProduct.ProductId) {
      this.product = this.existingProduct;
    }
    else {
      this.product.CompanyId = COMPANY;
      this.product.CreateUserId = COMPANY;
      this.product.ModifyUserId = COMPANY;
      this.productService.getProducts(COMPANY);

      this.productService.productListObservable.subscribe(data => {
        if (data) {
          this.product.Code = `P00${data.length + 1}`;
        }
      });
    }



    this.companyCategoryService.companyCategoryListObservable.subscribe(data => {
      this.categories = data;
      if (this.categories && this.categories.length) {
        this.parentCategories = this.categories.filter(x => x.CategoryType === 'Parent');
        this.categories.map(x => x.IsSelected = false);
        if (this.product && this.product.ProductId) {
          this.chilndrenCategories = this.categories.filter(x => x.ParentId === this.product.ParentCategoryId);
        }
      }
    });
  }
  saveProduct() {
    this.product.ProductSlug = this.productService.generateSlug(COMPANY, this.product.Name, this.product.Code);
    if (this.product.ProductId && this.product.CreateDate) {
      this.productService.update(this.product).subscribe(data => {
        if (data) {
          this.openSnackBar('product update successfully', 'Done!');
          // this.showModal = true;
          // this.modalModel.routeTo = 'dashboard/set-up-company-variations';
          // this.modalModel.body = ['One more step before adding your first product.'];
          // this.modalModel.body.push('In Fashion we can have a lot of varitions (sizes & colours)!');
          // this.modalModel.body.push('Please choose what is relavant to your shop.');
          // this.modalModel.ctaLabel = 'Setup Variations';
          // this.modalModel.ctaLabel = 'Setup Variations';
          // this.modalModel.heading = `You're almost done🙂`;
          this.addingProductFinished.emit(data);
        }
      });
    } else {
      this.productService.add(this.product).subscribe(data => {
        if (data) {
          this.addingProductFinished.emit(data);
        }
      });
    }
    alert('Done! (Better popup is comming.)');
  }
  back() {
    this.router.navigate([`/dashboard/products`]);
  }
  selectCategory(categoryId) {
    if (categoryId) {
      this.chilndrenCategories = this.categories.filter(x => x.ParentId === categoryId);
    }
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.uploadService.uploadFile(formData).subscribe(url => {
        this.product.FeaturedImageUrl = `${environment.API_URL}/api/upload/${url}`;
      });

    });




  }


  openSnackBar(message, heading) {
    this.snackBar.open(message, heading, {
      duration: 3000
    });

  }
}
