import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TaskService } from 'src/services/task.service';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { Task } from '../interfaces/task';
import { AddTaskComponent } from '../add-task/add-task.component';
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

 filterInput: string = '';

constructor(public taskService: TaskService, private dialog: MatDialog, public authService: AuthenticationService) {}

async ngOnInit() {
  await this.taskService.getAllTasksForCurrentUser();
  this.taskService.filterTasksByCategory();
}

drop(event: CdkDragDrop<Task[]>, listname: string) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
      console.log(event);
      console.log(event.item.data)
    this.updateTaskCategoryFirestore(event, listname)
  }
}

updateTaskCategoryFirestore(event: CdkDragDrop<Task[]>, listname: string) {
  for (let index = 0; index < this.taskService.tasks.length; index++) {
    const task = this.taskService.tasks[index];
    if (task.id === event.item.data.id) {
      if (listname === 'todo'){
        task.status = listname;
        this.taskService.updateTaskCategory(task)
    } 
    if (listname === 'inProgress'){
      task.status = listname;
      this.taskService.updateTaskCategory(task)
    } 
    if (listname === 'feedback') {
      task.status = listname;
      this.taskService.updateTaskCategory(task)
    }
    if (listname === 'done'){
      task.status = listname;
      this.taskService.updateTaskCategory(task)
    }
      this.taskService.filterTasksByCategory();
      return
    }
  }
}

filterBoard(value:string) {
  this.taskService.filterTasksByCharacters(value);
}

getInitials(name: string) {
  let initials = name.split(' ').map(word => word.charAt(0)).join('');
  return initials
}

openAddTaskDialog(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.panelClass = 'dialog-style';
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
    subtasks: task.subtasks,
    id: task.id
  }
  this.dialog.closeAll();
  this.dialog.open(TaskDetailsComponent, dialogConfig);
}

countDoneSubtasks(subtasks:any) {
  let counter = 0;
  subtasks.forEach((task: { done: boolean; }) => {
  if (task.done) counter++; 
  })
  return counter;
}

}

