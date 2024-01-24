import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { onSnapshot, query, where, addDoc } from '@angular/fire/firestore';
import { collection } from 'rxfire/firestore';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks:any[] = [];
  urgentTasks:number = 0;

  todo:any[] = [];
  inProgress: any[] = [];
  feedback:any[] = [];
  done:any[] = [];


  constructor(private authService: AuthenticationService) {}

  async getAllTasksForCurrentUser() {
    return new Promise<void>((resolve, reject) => {
      const q = query(this.authService.getTasksRef(), where('assignedUsers', 'array-contains', this.authService.userData.uid));
      onSnapshot(q, doc => {
        console.log('onSnapshot wurde aufgerufen');
        this.tasks = [];
        doc.forEach(doc => {
          this.tasks.push({...doc.data()});
        });
        console.log(this.tasks);
        resolve();
      }, error => {
        console.error('Fehler beim Abrufen der Aufgaben: ', error);
        reject(error);
      });
    });
  }

  countUrgentTasks() {
    this.urgentTasks = 0;
    this.tasks.forEach(task => {
      if (task.prio === 'urgent') this.urgentTasks++;
    })
  }

  clearBoard() {
    this.todo = [];
    this.inProgress = [];
    this.feedback = [];
    this.done = [];
    this.countUrgentTasks();
  }

  filterTasks() {
    this.clearBoard()
    this.tasks.filter((task) => {
      if (task.status === 'todo') this.todo.push(task);
      if (task.status === 'done') this.done.push(task);
      if (task.status === 'in progress') this.inProgress.push(task);
      if (task.status === 'feedback') this.feedback.push(task);
    })
    console.log(this.todo)
}

  async addTask(task: any) {
    const docRef = await addDoc(this.authService.getTasksRef(), {
      assignedUsers: task.assignedUsers,
      category: task.category,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      subtasks: task.subtasks,
      title: task.title,
    }) 
    console.log(docRef.id)
  }
  

}