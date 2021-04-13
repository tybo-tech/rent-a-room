import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Company, NavigationModel, User } from 'src/models';
import { Booking } from 'src/models/booking.model';
import { AccountService, CompanyService, NavigationService } from 'src/services';
import { BookingService } from 'src/services/booking.service';
import { CUSTOMER, PARTNER } from 'src/shared/constants';

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss']
})
export class HomeNavComponent implements OnInit {
  navItems: NavigationModel[];
  toolbarItems: NavigationModel[];
  @Input() showNav: boolean;
  @Input() hideTabs: boolean;
  @Output() navAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedItem: EventEmitter<string> = new EventEmitter<string>();
  shopping: string;
  showMenu: boolean;
  user: User;
  booking: Booking;
  cartCount = 0;
  showCart: boolean;
  navigate: NavigationModel = {};
  company: Company;
  tabsList: TablsModel[] = [
    { Name: 'Adventure', Value: 'Adventure', Class: ['active'], Icon: 'hiking' },
    { Name: 'Nature', Value: 'Nature', Class: [], Icon: 'local_florist' },
    { Name: ' Sights & tours', Value: 'Sights-tours', Class: [], Icon: 'tour' },
    { Name: 'Luxury', Value: 'Luxury', Class: [], Icon: 'star' },
  ];
  constructor(
    private navigationService: NavigationService,
    private accountService: AccountService,
    private router: Router,
    private bookingService: BookingService,
    private companyService: CompanyService
  ) {

  }

  ngOnInit() {
    this.booking = this.bookingService.currentBookingValue;
    this.company = this.companyService.currentCompanyValue;
    if (this.booking && this.booking.BookingItems && this.booking.BookingItems.length) {
      this.cartCount = this.booking.BookingItems.length;
    }
    this.user = this.accountService.currentUserValue;
    this.navigationService.getHomeNavigation().subscribe(data => {
      if (data.length > 0) {
        this.navItems = data;
        this.navItems[0].Class = 'active';
      }
    });

    this.navigationService.getToolbarNavigation().subscribe(data => {
      if (data.length > 0) {
        this.toolbarItems = data;
      }
    });

  }

  actionClick() {
    // this.navAction.emit(true);
  }

  navItemClicked(name) {
    this.selectedItem.emit(name);
    this.navItems.forEach(item => {
      if (item.Label === name) {
        item.Class = 'active';
      } else {
        item.Class = '';
      }
    });
  }
  login() {
    this.router.navigate(['sign-in']);
  }
  register() {
    this.navigate.Role = CUSTOMER;
    this.navigationService.updateNavigationState(this.navigate);
    this.router.navigate(['sign-up']);
  }
  partner() {
    this.navigate.Role = PARTNER;
    this.navigationService.updateNavigationState(this.navigate);
    this.router.navigate(['partner-welcome']);
  }
  contact() {
    this.router.navigate(['contact']);
  }
  tab(tab: TablsModel) {
    this.tabsList.map(x => x.Class = []);
    tab.Class = ['active'];
    this.navAction.emit(tab.Value);
    return;
  }

  toggle() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    this.user = null;
    this.accountService.updateUserState(null);
  }
  cart() {
    // this.showCart = !this.showCart;
    this.router.navigate(['my-cart']);
  }
  toCompany() {
    this.router.navigate(['/dashboard/company', this.company.CompanyId]);
  }
}


export interface TablsModel {
  Name: string;
  Value: string;
  Class: string[];
  Icon: string;
}