import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { UxService } from 'src/services/ux.service';
import { LoaderUx, MessageDialogUx } from 'src/models/UxModel.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  @Output() ActionClicked: EventEmitter<boolean> = new EventEmitter();
  eventsSubject: Subject<void> = new Subject<void>();

  mobileQuery: MediaQueryList;
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  showNav: boolean;
  loadingUx: LoaderUx;
  dialogUx: MessageDialogUx;
  message: string;

  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private uxService: UxService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.showNav = true;
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

  toggleNav() {
    alert('Action taken')
    this.showNav = !this.showNav;
  }

  goto(route) {
    this.router.navigate([route]);
  }

  actionClicked(url) {
    this.dialogUx.ShowDialog = false;
    if(url === 'addCompany'){
     this.uxService.updateDialogState(this.dialogUx);
      this.router.navigate(['dashboard/company', 'add']);
    } else {
      this.router.navigate(['dashboard']);
    }
  }

}


