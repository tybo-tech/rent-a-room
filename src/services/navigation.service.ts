import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationModel } from 'src/models';
import { NAVIGATION } from 'src/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private navigationBehaviorSubject: BehaviorSubject<NavigationModel>;
  public navigationObservable: Observable<NavigationModel>;
  constructor(
    private http: HttpClient
  ) {
    this.navigationBehaviorSubject = new BehaviorSubject<NavigationModel>(JSON.parse(localStorage.getItem(NAVIGATION)) || null);
    this.navigationObservable = this.navigationBehaviorSubject.asObservable();
  }
  getHomeNavigation(): Observable<any[]> {
    return this.http.get<any[]>('assets/locale/home-navigation.json');
  }
  getToolbarNavigation(): Observable<any[]> {
    return this.http.get<any[]>('assets/locale/toolbar-navigation.json');
  }
  updateNavigationState(model: NavigationModel) {
    this.navigationBehaviorSubject.next(model);
    localStorage.setItem(NAVIGATION, JSON.stringify(model));
  }

  public get currentNavValue(): NavigationModel {
    return this.navigationBehaviorSubject.value;
  }
}
