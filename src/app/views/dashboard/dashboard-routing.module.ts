import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoaderComponent } from 'src/app/shared_components';
import { ProductProfileComponent } from 'src/shared/components/product-profile/product-profile.component';
import { UserProfileComponent } from 'src/shared/components/user-profile/user-profile.component';
import { AddAddressComponent, AddressComponent } from './address';
import { SetUpCompanyCategoriesComponent } from './categories/set-up-company-categories/set-up-company-categories.component';
import { SetUpCompanySubCategoriesComponent } from './categories/set-up-company-categories/set-up-company-sub-categories/set-up-company-sub-categories.component';
import { AddCompanyComponent, CompanyComponent, CompanyOverviewComponent } from './company';
import { AddCustomerComponent } from './customers/add-customer/add-customer.component';
import { CustomerComponent } from './customers/customer/customer.component';
import { CustomersComponent } from './customers/customers/customers.component';
import { AddStylistComponent } from './customers/stylists/add-stylist/add-stylist.component';
import { StylistComponent } from './customers/stylists/stylist/stylist.component';
import { StylistsComponent } from './customers/stylists/stylists.component';
import { DashboardLoaderComponent } from './dashboard-loader';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddExperienceComponent } from './experience/add-experience/add-experience.component';
import { ListExperiencesComponent } from './experience/list-experiences/list-experiences.component';
import { ImagesComponent } from './images/images.component';
import { AddJobCardComponent } from './jobs/add-job-card/add-job-card.component';
import { AddJobWorkItemComponent } from './jobs/add-job-work-item/add-job-work-item.component';
import { JobCardsComponent } from './jobs/job-cards/job-cards.component';
import { JobWorkListComponent } from './jobs/job-work-list/job-work-list.component';
import { VeiwJobCardComponent } from './jobs/veiw-job-card/veiw-job-card.component';
import { DashNavComponent } from './navigations/dash-nav/dash-nav.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { ItemSelectorComponent } from './orders/item-selector/item-selector.component';
import { ListOrdersComponent } from './orders/list-orders/list-orders.component';
import { OrderComponent } from './orders/order/order.component';
import { OverviewComponent } from './overview/overview.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { ProductVariationsComponent } from './products/product-variations/product-variations.component';
import { ProductComponent } from './products/product/product.component';
import { ListTimeslotComponent } from './timeslot/list-timeslot/list-timeslot.component';
import { UserFeedbackComponent } from './user-feedback/user-feedback.component';
import { ProductCombinationsComponent } from './variation/product-combinations/product-combinations.component';
import { SetUpCompanyVariationOptionsComponent } from './variation/set-up-company-variation-options/set-up-company-variation-options.component';
import { SetUpCompanyVariationsComponent } from './variation/set-up-company-variations/set-up-company-variations.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: '', component: OverviewComponent },
      { path: 'customer/:id', component: CustomerComponent },
      { path: 'product/:id', component: ProductComponent },
      { path: 'order/:id', component: OrderComponent },
      { path: 'create-order', component: CreateOrderComponent },
      { path: 'products', component: ListProductsComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'bookings', component: ListOrdersComponent },
      { path: 'set-up-company-categories', component: SetUpCompanyCategoriesComponent },
      { path: 'set-up-company-sub-categories', component: SetUpCompanySubCategoriesComponent },
      { path: 'set-up-company-variations', component: SetUpCompanyVariationsComponent },
      { path: 'set-up-company-variation-options', component: SetUpCompanyVariationOptionsComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'add-product', component: ProductVariationsComponent },
      { path: 'product-variations/:id', component: ProductVariationsComponent },
      { path: 'product-combinations/:id', component: ProductCombinationsComponent },
      { path: 'time-slots', component: ListTimeslotComponent },
      { path: 'job-card/:id', component: VeiwJobCardComponent },
      { path: 'stylists', component: StylistsComponent },
      { path: 'stylist/:id', component: StylistComponent },
      { path: 'add-experience/:id', component: AddExperienceComponent },
      { path: 'list-experiences', component: ListExperiencesComponent },
      { path: 'company/:id', component: CompanyComponent },
      { path: 'overview', component: CompanyOverviewComponent },
      { path: 'address/:id', component: AddressComponent },
    ]
  }
];
export const declarations: Array<any> = [
  DashboardComponent,
  LoaderComponent,
  CustomerComponent,
  CustomersComponent,
  ListProductsComponent,
  ProductComponent,
  UserProfileComponent,
  ProductProfileComponent,
  ListOrdersComponent,
  OrderComponent,
  CreateOrderComponent,
  ItemSelectorComponent,
  DashNavComponent,
  OverviewComponent,
  SetUpCompanyCategoriesComponent,
  SetUpCompanySubCategoriesComponent,
  SetUpCompanyVariationsComponent,
  SetUpCompanyVariationOptionsComponent,
  UserFeedbackComponent,
  AddProductComponent,
  ProductVariationsComponent,
  ProductCombinationsComponent,
  JobCardsComponent,
  AddJobCardComponent,
  VeiwJobCardComponent,
  JobWorkListComponent,
  AddJobWorkItemComponent,
  ListTimeslotComponent,
  AddCustomerComponent,
  StylistsComponent,
  StylistComponent,
  AddStylistComponent,
  AddExperienceComponent,
  ListExperiencesComponent,
  ImagesComponent,
  AddCompanyComponent,
  CompanyComponent,
  DashboardLoaderComponent,
  CompanyOverviewComponent,
  AddressComponent,
  AddAddressComponent
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

