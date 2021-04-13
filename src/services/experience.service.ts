import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Experience } from 'src/models/modal.experience';


@Injectable({
  providedIn: 'root'
})
export class ExperienceService {



  private ExperienceListBehaviorSubject: BehaviorSubject<Experience[]>;
  public experienceListObservable: Observable<Experience[]>;

  private ExperienceBehaviorSubject: BehaviorSubject<Experience>;
  public ExperienceObservable: Observable<Experience>;
  url: string;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.ExperienceListBehaviorSubject = new BehaviorSubject<Experience[]>(JSON.parse(localStorage.getItem('ExperiencesList')) || []);
    this.ExperienceBehaviorSubject = new BehaviorSubject<Experience>(JSON.parse(localStorage.getItem('currentExperience')) || null);
    this.experienceListObservable = this.ExperienceListBehaviorSubject.asObservable();
    this.ExperienceObservable = this.ExperienceBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentExperienceValue(): Experience {
    return this.ExperienceBehaviorSubject.value;
  }

  updateExperienceListState(experiencesList: Experience[]) {
    this.ExperienceListBehaviorSubject.next(experiencesList);
    localStorage.setItem('ExperiencesList', JSON.stringify(experiencesList));
  }
  updateExperienceState(experience: Experience) {
    this.ExperienceBehaviorSubject.next(experience);
    localStorage.setItem('currentExperience', JSON.stringify(experience));
  }
  add(experience: Experience) {
    return this.http.post<Experience>(`${this.url}/api/experience/add-experience.php`, experience);
  }
  update(experience: Experience) {
    return this.http.post<Experience>(`${this.url}/api/experience/update-experience.php`, experience);
  }
  getExperiences(companyId: string) {
    this.http.get<Experience[]>(`${this.url}/api/experience/get-experiences.php?CompanyId=${companyId}`).subscribe(data => {
      this.updateExperienceListState(data || []);
    });
  }
  
  getAllActiveExperiences() {
    this.http.get<Experience[]>(`${this.url}/api/experience/get-all-active-experiences.php`).subscribe(data => {
      this.updateExperienceListState(data || []);
    });
  }
  

  getExperience(experienceId: string) {
    this.http.get<Experience>(`${this.url}/api/experience/get-experience.php?ExperienceId=${experienceId}`).subscribe(data => {
      if (data) {
        this.updateExperienceState(data);
      }
    });
  }


  getExperienceSync(experienceId: string) {
    return this.http.get<Experience>(`${this.url}/api/experience/get-experience.php?ExperienceId=${experienceId}`);
  }


  generateSlug(name: string, code: string, companyName = ''): string {
    let slug = name.toLocaleLowerCase().split(' ').join('-');
    slug = `${code.toLocaleLowerCase()}-${slug}-${companyName}`;
    return slug;
  }



}
