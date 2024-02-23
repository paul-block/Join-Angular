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

  constructor(public taskService: TaskService, private dialog: MatDialog, public authService: AuthenticationService) { }

  async ngOnInit() {
    await this.taskService.getAllTasksForCurrentUser();
    this.taskService.filterTasksByCategory();
  }

  /**
   * Handles the drop event when a task is moved within or between lists.
   * @param {CdkDragDrop<Task[]>} event - The drag and drop event.
   * @param {string} listname - The name of the list where the task is dropped.
   */
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
      this.updateTaskCategoryFirestore(event, listname);
    }
  }

  /**
   * Updates the task category in Firestore after it has been moved between lists.
   * @param {CdkDragDrop<Task[]>} event - The drag and drop event.
   * @param {string} listname - The name of the list where the task is dropped.
   */
  updateTaskCategoryFirestore(event: CdkDragDrop<Task[]>, listname: string) {
    for (let index = 0; index < this.taskService.tasks.length; index++) {
      const task = this.taskService.tasks[index];
      if (task.id === event.item.data.id) {
        if (listname === 'todo') {
          task.status = listname;
          this.taskService.updateTaskCategory(task);
        }
        if (listname === 'inProgress') {
          task.status = listname;
          this.taskService.updateTaskCategory(task);
        }
        if (listname === 'feedback') {
          task.status = listname;
          this.taskService.updateTaskCategory(task);
        }
        if (listname === 'done') {
          task.status = listname;
          this.taskService.updateTaskCategory(task);
        }
        this.taskService.filterTasksByCategory();
        return;
      }
    }
  }

  /**
   * Filters the board tasks based on the provided value.
   * @param {string} value - The value to filter tasks by.
   */
  filterBoard(value: string) {
    this.taskService.filterTasksByCharacters(value);
  }

  /**
   * Gets the initials from a name.
   * @param {string} name - The name from which to extract initials.
   * @returns {string} The initials extracted from the name.
   */
  getInitials(name: string) {
    let initials = name.split(' ').map(word => word.charAt(0)).join('');
    return initials;
  }

  /**
   * Opens the add task dialog.
   */
  openAddTaskDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'dialog-style';
    this.dialog.closeAll();
    this.dialog.open(AddTaskComponent, dialogConfig);
  }

  /**
   * Opens the task details dialog.
   * @param {Task} task - The task for which to display details.
   */
  openTaskDetailsDialog(task: Task) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'dialog-style';
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
    };
    this.dialog.closeAll();
    this.dialog.open(TaskDetailsComponent, dialogConfig);
  }

  /**
   * Counts the number of completed subtasks.
   * @param {any} subtasks - The array of subtasks to count.
   * @returns {number} The count of completed subtasks.
   */
  countDoneSubtasks(subtasks: any) {
    let counter = 0;
    subtasks.forEach((task: { done: boolean; }) => {
      if (task.done) counter++;
    });
    return counter;
  }

}

