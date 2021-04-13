import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Job } from 'src/models/job.model';
import { AccountService } from 'src/services';
import { JobService } from 'src/services/job.service';
import { COMPANY } from 'src/shared/constants';

@Component({
  selector: 'app-job-cards',
  templateUrl: './job-cards.component.html',
  styleUrls: ['./job-cards.component.scss']
})
export class JobCardsComponent implements OnInit {
  jobCards = [];
  user: User;
  constructor(
    private accountService: AccountService,
    private jobService: JobService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.jobService.getJobs(COMPANY);
    this.jobService.jobListObservable.subscribe(data => {
      this.jobCards = data;
    })
  }
  add() {
    this.router.navigate(['dashboard/job-card/add']);
  }
  view(item: Job) {
    this.jobService.updatejobState(item);
    this.router.navigate(['dashboard/job-card', item.JobId]);
   }
}
