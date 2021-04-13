import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CompanyCategory } from 'src/models/company.category.model';
import { Images } from 'src/models/images.model';
import { Product } from 'src/models';
import { Experience } from 'src/models/modal.experience';


@Injectable({
  providedIn: 'root'
})
export class ImagesService {


  
  url: string;

  constructor(
    private http: HttpClient
  ) {
  
    this.url = environment.API_URL;
  }

  getByOtherId(otherId: string) {
    return this.http.get<CompanyCategory>(`${this.url}/api/images/get-by-otherid.php?OtherId=${otherId}`)
  }

  update(image: Images) {
    return this.http.post<Images>(
      `${this.url}/api/images/update-image.php`, image
    );
  }
  updateRange(images: Images[]) {
    return this.http.post<Experience>(
      `${this.url}/api/images/update-image-range.php`, images
    );
  }
  add(company: Images) {
    return this.http.post<Images>(
      `${this.url}/api/images/add-image.php`, company
    );
  }



}
