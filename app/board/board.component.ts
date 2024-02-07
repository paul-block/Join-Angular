import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TaskService } from 'src/services/task.service';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { Task } from '../interfaces/task';
import { AddTaskComponent } from '../add-task/add-task.component';
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

constructor(public taskService: TaskService, private dialog: MatDialog) {}

drop(event: CdkDragDrop<Task[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
    console.log(this.taskService.inProgress)
    console.log(this.taskService.todo)
  }
}

getInitials(name: string) {
  let initials = name.split(' ').map(word => word.charAt(0)).join('');
  return initials
}

openAddTaskDialog(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.panelClass ='dialog-style';
  dialogConfig.width = '500px';
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
    assignedUserIDs: task.assignedUserIDs,
    prio: task.prio,
    status: task.status,
    subtasks: task.subtasks,
    id: task.id
  }
  this.dialog.closeAll();
  this.dialog.open(TaskDetailsComponent, dialogConfig);
}

}

