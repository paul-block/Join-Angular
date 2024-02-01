import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/interfaces/task';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  constructor(private dialog: MatDialog,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public taskData: any){
    }

    ngOnInit() {}

    getInitials(name: string) {
      let initials = name.split(' ').map(word => word.charAt(0)).join('');
      return initials
    }
  
}


