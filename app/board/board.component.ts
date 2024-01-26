import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
constructor(public taskService: TaskService) {}

async ngOnInit() {
  await this.taskService.getAllTasksForCurrentUser();
  this.taskService.filterTasks();
}

getInitials(name: string) {
  let initials = name.split(' ').map(word => word.charAt(0)).join('');
  return initials
}

}

