import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Company } from 'src/models';
import { User } from 'src/models/user.model';
import { LoaderUx, MessageDialogUx } from 'src/models/UxModel.model';
import { CompanyService } from 'src/services';
import { AccountService } from 'src/services/account.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  selectedIndex = 3;
  user: User;
  company: Company;
  loadingUx: LoaderUx;
  dialogUx: MessageDialogUx;

  message:string;
  constructor(
    private accountService: AccountService,
    private companyService: CompanyService,
    private uxService: UxService,
    private router: Router
   ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if(this.user) {
      this.companyService.getCompany(this.user.CompanyId).subscribe(data => {
        if(data) {
          this.companyService.updateCompanyState(data);
        }
      })
    }

    this.uxService.uxMessagePopObservable.subscribe(data => {
      this.message = data;
      const id = setTimeout(() => {
        this.message = null;
      }, 3000);
    });
    this.uxService.uxLoadingPopObservable.subscribe(data => {
      const id = setTimeout(() => {
        this.loadingUx = data;
      }, 0);
    });
    this.uxService.uxDialogPopObservable.subscribe(data => {
      const id = setTimeout(() => {
        this.dialogUx = data;
       }, 0);
    });
  }

  onTabChanged(event: MatTabChangeEvent) {
    console.log(event.index);
    this.selectedIndex = event.index;
  }


  actionClicked(url) {
    console.log(url);
    this.dialogUx.ShowDialog = false;
    this.uxService.updateDialogState(this.dialogUx);
    if(url){
      this.router.navigate([url]);
    }
  }

  navigateToNextActiondDalogUx(dialogUx: MessageDialogUx){
    dialogUx.ShowDialog = false;
    if(dialogUx.NavigateTo){
      this.router.navigate([dialogUx.NavigateTo]);
    }
  }

}
