import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { onSnapshot, query, where, addDoc, updateDoc, arrayUnion, QuerySnapshot } from '@angular/fire/firestore';
import { Task } from 'src/app/interfaces/task';
import { Observable, Subject } from 'rxjs';


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

  selectedTask: any;
  private tasksSubject: Subject<any[]> = new Subject<any[]>();
  public tasks$: Observable<any[]> = this.tasksSubject.asObservable();


  constructor(private authService: AuthenticationService) {
    this.getAllTasksForCurrentUser();
    this.tasks$.subscribe(tasks => {
      this.tasks = tasks; 
    });
  }

  // async getAllTasksForCurrentUser() {
  //   return new Promise<void>((resolve, reject) => {
  //     const q = query(this.authService.getTasksRef(), where('assignedUserIDs', 'array-contains', this.authService.userData.uid));
  //     onSnapshot(q, doc => {
  //       console.log('onSnapshot wurde aufgerufen');
  //       this.tasks = [];
  //       doc.forEach(doc => {
  //         this.tasks.push({...doc.data()});
  //       });
  //       console.log(this.tasks);
  //       resolve();
  //     }, error => {
  //       console.error('Fehler beim Abrufen der Aufgaben: ', error);
  //       reject(error);
  //     });
  //   });
  // }

  async getAllTasksForCurrentUser() {
    const q = query(this.authService.getTasksRef(), where('assignedUserIDs', 'array-contains', this.authService.userData.uid));
    onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      const tasks: { [x: string]: any; }[] = [];
      querySnapshot.forEach(doc => {
        tasks.push({...doc.data()});
        this.filterTasks();
        console.log(tasks)
      });
      this.tasksSubject.next(tasks);
    }, error => {
      console.error('Fehler beim Abrufen der Aufgaben: ', error);
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
      assignedUserIDs: task.assignedUserIDs,
      category: task.category,
      description: task.description,
      dueDate: task.dueDate,
      prio: task.prio,
      status: task.status,
      subtasks: task.subtasks,
      title: task.title,
    }) 
    await updateDoc(docRef, {
      id: docRef.id
    });
    console.log(docRef.id)
  }

  async updateTask(task: Task){
      console.log('task infos updated');
      console.log(task.assignedUserIDs)
  
      await updateDoc(this.authService.getSingleRefDoc('tasks', task.id), {
        assignedUsers: task.assignedUsers,
        assignedUserIDs: task.assignedUserIDs,
        category: task.category,
        description: task.description,
        dueDate: task.dueDate,
        prio: task.prio,
        status: task.status,
        subtasks: task.subtasks,
        title: task.title,
        id: task.id
      })
    }
  }
  

