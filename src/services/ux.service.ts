import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HomeNavUx, LoaderUx, MessageDialogUx } from 'src/models/UxModel.model';

@Injectable({
  providedIn: 'root'
})


export class UxService {


  private uxMessagePopBehaviorSubject: BehaviorSubject<string>;
  public uxMessagePopObservable: Observable<string>;

  private navBarLogoBehaviorSubject: BehaviorSubject<HomeNavUx>;
  public navBarLogoObservable: Observable<HomeNavUx>;

  private showIntroPageBehaviorSubject: BehaviorSubject<string>;
  public showIntroPageObservable: Observable<string>;

  private uxLoadingBehaviorSubject: BehaviorSubject<LoaderUx>;
  public uxLoadingPopObservable: Observable<LoaderUx>;

  private uxDialogBehaviorSubject: BehaviorSubject<MessageDialogUx>;
  public uxDialogPopObservable: Observable<MessageDialogUx>;

  constructor() {
    this.uxMessagePopBehaviorSubject = new BehaviorSubject<string>(null);
    this.uxMessagePopObservable = this.uxMessagePopBehaviorSubject.asObservable();

    this.uxLoadingBehaviorSubject = new BehaviorSubject<LoaderUx>(null);
    this.uxLoadingPopObservable = this.uxLoadingBehaviorSubject.asObservable();

    this.uxDialogBehaviorSubject = new BehaviorSubject<MessageDialogUx>(null);
    this.uxDialogPopObservable = this.uxDialogBehaviorSubject.asObservable();

    this.navBarLogoBehaviorSubject = new BehaviorSubject<HomeNavUx>(JSON.parse(localStorage.getItem('HomeNavUx')));
    this.navBarLogoObservable = this.navBarLogoBehaviorSubject.asObservable();

    this.showIntroPageBehaviorSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('ShowIntroPage')));
    this.showIntroPageObservable = this.showIntroPageBehaviorSubject.asObservable();

  }

  public get currentMessagePopValue(): string {
    return this.uxMessagePopBehaviorSubject.value;
  }
  public get currentNavBarLogoValue(): HomeNavUx {
    return this.navBarLogoBehaviorSubject.value;
  }

  updateMessagePopState(state: string) {
    if (state) {
      this.uxMessagePopBehaviorSubject.next(state);
    }
  }
  updateNavBarLogoState(state: HomeNavUx) {
    if (state) {
      this.navBarLogoBehaviorSubject.next(state);
      localStorage.setItem('HomeNavUx', JSON.stringify(state));
    }
  }

  updateLoadingState(state: LoaderUx) {
    if (state) {
      this.uxLoadingBehaviorSubject.next(state);
    }
  }
  updateDialogState(state: MessageDialogUx) {
    if (state) {
      this.uxDialogBehaviorSubject.next(state);
      localStorage.setItem('dialogUx', JSON.stringify(state));
    }
  }

  hideLoader() {
    this.uxLoadingBehaviorSubject.next({ Loading: false, Message: undefined });
  }
  showLoader() {
    this.uxLoadingBehaviorSubject.next(({ Loading: true, Message: 'Loading, please wait.' }));
  }
  updateShowIntroPageState(state: string) {
    this.showIntroPageBehaviorSubject.next(state);
    localStorage.setItem('ShowIntroPage', JSON.stringify(state));
  }
}

