import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from 'src/models';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private addressListBehaviorSubject: BehaviorSubject<Address[]>;
  public addressListObservable: Observable<Address[]>;

  private addressBehaviorSubject: BehaviorSubject<Address>;
  public addressObservable: Observable<Address>;
  url: string;
  constructor(
    private http: HttpClient
  ) {
    this.addressListBehaviorSubject = new BehaviorSubject<Address[]>(JSON.parse(localStorage.getItem('AddressList')));
    this.addressBehaviorSubject = new BehaviorSubject<Address>(JSON.parse(localStorage.getItem('Address')));

    this.addressListObservable = this.addressListBehaviorSubject.asObservable();
    this.addressObservable = this.addressBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  // public gets.
  public get currentAddressListValue(): Address[] {
    return this.addressListBehaviorSubject.value;
  }

  public get currentAddressValue(): Address {
    return this.addressBehaviorSubject.value;
  }

  // update state
  updateAddressListState(addresses:Address[]) {
    this.addressListBehaviorSubject.next(addresses);
    localStorage.setItem('AddressList', JSON.stringify(addresses));
  }

  updateAddressState(address: Address) {
    this.addressBehaviorSubject.next(address);
    localStorage.setItem('Address', JSON.stringify(address));
  }

  getByOtherId(otherId: string): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.url}/api/address/get-by-otherid.php?OtherId=${otherId}`);
  }

  getById(addressId: string): Observable<Address> {
    return this.http.get<Address>(`${this.url}/api/address/get-by-id.php?AddressId=${addressId}`);
  }

  add(address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.url}/api/address/add.php`, address);
  }

  update(address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.url}/api/address/update.php`, address);
  }
}
