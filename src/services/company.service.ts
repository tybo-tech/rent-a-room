import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from 'src/models';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private companyListBehaviorSubject: BehaviorSubject<Company[]>;
  public companyListObservable: Observable<Company[]>;

  private companyBehaviorSubject: BehaviorSubject<Company>;
  public companyObservable: Observable<Company>;

  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.companyListBehaviorSubject = new BehaviorSubject<Company[]>(JSON.parse(localStorage.getItem('CompanysList')) || []);
    this.companyBehaviorSubject = new BehaviorSubject<Company>(JSON.parse(localStorage.getItem('currentCompany')) || null);
    this.companyListObservable = this.companyListBehaviorSubject.asObservable();
    this.companyObservable = this.companyBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentCompanyValue(): Company {
    return this.companyBehaviorSubject.value;
  }
  public get currentCompanyListValue(): Company[] {
    return this.companyListBehaviorSubject.value;
  }

  updateCompanyState(model: Company) {
    this.companyBehaviorSubject.next(model);
    localStorage.setItem('currentCompany', JSON.stringify(model));
  }
  updateCompanyListState(model: Company[]) {
    this.companyListBehaviorSubject.next(model);
    localStorage.setItem('CompanysList', JSON.stringify(model));
  }

  add(model: Company) {
    return this.http.post<Company>(`${this.url}/api/company/add-company.php`, model);
  }
  update(model: Company) {
    return this.http.post<Company>(`${this.url}/api/company/update-company.php`, model);
  }

  getCompany(companyId: string) {
    return this.http.get<Company>(`${this.url}/api/company/get-company.php?CompanyId=${companyId}`);
  }
}
