import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from 'src/models';
import { UploadService, UserService } from 'src/services';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  @Input() customer: User;
  // <app-add-customer [user]="user">

  showLoader;
  constructor(
    private uploadService: UploadService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }
    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `cervidae.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.uploadService.uploadFile(formData).subscribe(url => {
        this.customer.Dp = `${environment.API_URL}/api/upload/${url}`;
      });

    });
  }

  save() {
    if (this.customer.UserId && this.customer.UserId.length > 5) {
      this.userService.updateUser(this.customer);
      alert('Customer updated');
      this.back();
    }
    else {
      this.userService.add(this.customer).subscribe(data => {
        console.log(data);
        alert('Customer created');
        this.back();
      });
    }
  }
  back() {
    this.router.navigate([`/dashboard/customers`]);
  }
}
