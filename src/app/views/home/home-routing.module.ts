import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from 'src/app/account/contact/contact.component';
import { ForgotPasswordComponent, ResetPasswordComponent } from 'src/app/account/forgot-password';
import { SignInComponent } from 'src/app/account/sign-in';
import { SignUpComponent } from 'src/app/account/sign-up';
import { SignUpModalComponent } from 'src/app/account/sign-up-modal/sign-up-modal.component';
import { BookingComponent } from './booking/booking.component';
import { MyBookingsComponent } from './booking/my-bookings/my-bookings.component';
import { MyProfileComponent } from './booking/my-profile/my-profile.component';
import { CarouselComponent } from './carousel';
import { CartComponent, CheckoutComponent } from './cart';
import { PaymentCancelledComponent } from './cart/checkout/payment-cancelled/payment-cancelled.component';
import { ShopingSuccesfulComponent } from './cart/checkout/shoping-succesful/shoping-succesful.component';
import { DiscoverComponent } from './discover/discover.component';
import { FiitingRoomComponent } from './fiiting-room/fiiting-room.component';
import { HomeLandingComponent } from './home-landing';
import { HomeLoaderComponent } from './home-loader';
import { HomeNavComponent } from './home-nav';
import { HomeToolbarNavigationComponent } from './home-toolbar-navigation/home-toolbar-navigation.component';
import { HomeComponent } from './home.component';
import { IntroPageComponent } from './intro-page/intro-page.component';
import { PartnerWelcomeComponent } from './partner-welcome';
import { ProductSectionCardComponent, ProductSectionComponent, ProductSectionDetailComponent } from './product-section';
import { ShopComponent } from './shop';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      // { path: '', component: PartnerWelcomeComponent },
      { path: '', component: DiscoverComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'my-home', component: MyProfileComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'fitting-room', component: FiitingRoomComponent },
      { path: 'product-details/:id', component: ProductSectionDetailComponent },
      { path: 'book/:id', component: BookingComponent },
      { path: 'shoping-succesful/:id', component: ShopingSuccesfulComponent },
      { path: 'payment-cancelled/:id', component: PaymentCancelledComponent },
      { path: 'my-bookings', component: MyBookingsComponent },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'discover', component: DiscoverComponent },
      { path: 'partner-welcome', component: PartnerWelcomeComponent },
      { path: 'my-cart', component: CartComponent },

    ]

  }
];

export const declarations = [
  SignInComponent,
  SignUpComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  HomeComponent,
  HomeLandingComponent,
  HomeNavComponent,
  ShopComponent,
  ProductSectionComponent,
  ProductSectionDetailComponent,
  FiitingRoomComponent,
  ProductSectionCardComponent,
  HomeToolbarNavigationComponent,
  CartComponent,
  CheckoutComponent,
  WelcomeComponent,
  BookingComponent,
  SignUpModalComponent,
  MyBookingsComponent,
  MyProfileComponent,
  PaymentCancelledComponent,
  ShopingSuccesfulComponent,
  ContactComponent,
  IntroPageComponent,
  DiscoverComponent,
  PartnerWelcomeComponent,
  HomeLoaderComponent,
  CarouselComponent
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
