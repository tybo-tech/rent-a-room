import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/models';
import { Job } from 'src/models/job.model';
import { AccountService } from 'src/services';
import { JobService } from 'src/services/job.service';
import { COMPANY } from 'src/shared/constants';

@Component({
  selector: 'app-veiw-job-card',
  templateUrl: './veiw-job-card.component.html',
  styleUrls: ['./veiw-job-card.component.scss']
})
export class VeiwJobCardComponent implements OnInit {
  job: Job;
  JobId: string;
  heading: string;
  selectedIndex: number;
  user: User;
  constructor(
    private activatedRoute: ActivatedRoute,
    private jobService: JobService,
    private router: Router,
    private accountService: AccountService,
    private _snackBar: MatSnackBar
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.JobId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.JobId === 'add') {
      this.job = {
        JobId: '',
        CompanyId: COMPANY,
        CustomerId: '',
        CustomerName: '',
        JobNo: '',
        Tittle: 'Make a hoodie dress',
        Description: '',
        TotalCost: 0,
        TotalDays: 0,
        StartDate: '',
        DueDate: '',
        Status: 'Not started',
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1
      };
      this.heading = `Adding new job`;

      this.jobService.jobListObservable.subscribe(data => {
        if (data) {
          this.job.JobNo = `J00${data.length + 1}`;
        }
      });
    } else {
      this.job = this.jobService.currentjobValue;
      this.heading = `Editing job | ${this.job.JobNo}`;
      this.jobService.getjob(this.job.JobId);
    }
  }
  back() {
    this.router.navigate([`/dashboard/jobs`]);
  }
  onTabChanged(event: MatTabChangeEvent) {
    console.log(event.index);
    this.selectedIndex = event.index;
  }
}
