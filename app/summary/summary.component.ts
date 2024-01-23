import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  
  todoAmount: number = 0;
  doneAmount: number = 0;
  urgentAmount: number = 0;
  tasksTotalAmount: number = 0;
  tasksInProgressAmount: number = 0;
  feedbackAmount: number = 0;

  username: string | undefined;

  constructor(private auth: AuthenticationService, private taskService: TaskService) {
  }

  async ngOnInit() {
    await this.taskService.getUserTasks();
    this.filterTasks();
    this.username = this.getUsername();
    console.log(this.taskService.tasks)
  }

  filterTasks() {
    this.taskService.tasks.filter((task) => {
      if (task.status === 'todo') this.todoAmount++;
      if (task.status === 'done') this.doneAmount++;
      if (task.prio === 'urgent') this.urgentAmount++;     
      if (task.status === 'in progress') this.tasksInProgressAmount++
      if (task.status === 'feedback') this.feedbackAmount++;
      this.tasksTotalAmount = this.taskService.tasks.length;
    })
}

  getUsername() {
    return this.auth.userData.name;
  }
}
