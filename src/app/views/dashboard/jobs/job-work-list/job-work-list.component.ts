import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/models';
import { JobWork } from 'src/models/job.work.model';
import { AccountService } from 'src/services';

@Component({
  selector: 'app-job-work-list',
  templateUrl: './job-work-list.component.html',
  styleUrls: ['./job-work-list.component.scss']
})
export class JobWorkListComponent implements OnInit {
  @Input() jobWorks: JobWork[];
  @Input() jobId: string;
  jobWork: JobWork;
  showModal: boolean;
  modalHeading: string;
  user: User;
  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
  }
  view(item) {

  }
  add() {
    this.jobWork = {
      JobWorkId: '',
      JobId: this.jobId,
      Tittle: '',
      Description: '',
      TotalCost: 0,
      Quantity: 0,
      TotalHours: '',
      StartDate: '',
      DueDate: '',
      Status: 'To do',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    };
    this.showModal = true;
    this.modalHeading = 'Add job work item';
  }
  doneAddingJobWork(item: JobWork) {
    this.showModal = false;
    this.jobWorks.push(item);
  }
  closeModal() {
    this.showModal = false;
  }
}
