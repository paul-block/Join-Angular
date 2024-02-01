import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TaskService } from 'src/services/task.service';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { Task } from '../interfaces/task';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {


constructor(public taskService: TaskService, private dialog: MatDialog) {}

async ngOnInit() {
  await this.taskService.getAllTasksForCurrentUser();
  this.taskService.filterTasks();
}

getInitials(name: string) {
  let initials = name.split(' ').map(word => word.charAt(0)).join('');
  return initials
}

openAddTaskDialog(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.panelClass ='dialog-style';
  dialogConfig.width = '700px';
  dialogConfig.height = '700px';
  this.dialog.closeAll();
  this.dialog.open(AddTaskComponent, dialogConfig);
}

openTaskDetailsDialog(task: Task){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.panelClass ='dialog-style';
  dialogConfig.data = {
    category: task.category,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    assignedUsers: task.assignedUsers,
    prio: task.prio,
    status: task.status,
    subtasks: task.subtasks
  }
  this.dialog.closeAll();
  this.dialog.open(TaskDetailsComponent, dialogConfig);
}

}

