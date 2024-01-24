import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  
  constructor(public auth: AuthenticationService, public taskService: TaskService) {}

  async ngOnInit() {
    if (this.auth.isLoggedIn) {
      await this.taskService.getAllTasksForCurrentUser();
      this.taskService.filterTasks();
      console.log(this.taskService.tasks)
    }
  }
}
