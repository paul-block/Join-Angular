import { Component } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  title: string = '';
  description: string = '';
  assignedUsers: string[] = [];
  dueDate: string = '';
  prio: string = '';
  category: string = '';
  subtasks: string[] = [];

  constructor(private taskService: TaskService, private authService: AuthenticationService){}

  createTaskObject() {
    const task = {
      assignedUsers: this.assignedUsers,
      category: this.category,
      description: this.description,
      dueDate: this.dueDate,
      status: this.prio,
      subtasks: this.subtasks,
      title: this.title,
    }
    return task;
  }

  addTask() {
    this.taskService.addTask(this.createTaskObject());
  }
}
