import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { onSnapshot, query, where, addDoc, updateDoc, deleteDoc, QuerySnapshot } from '@angular/fire/firestore';
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

  // Behaviour subject unsubscriben ? 

  // ngOnInit(): void {

  // }

  // ngOnDestroy(): void {
  //   this.tasks$.unsubscribe();
  // }



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
        this.filterTasksByCategory();
        // console.log(tasks)
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

  filterTasksByCategory() {
    this.clearBoard()
    this.tasks.filter((task) => {
      if (task.status === 'todo') this.todo.push(task);
      if (task.status === 'done') this.done.push(task);
      if (task.status === 'inProgress') this.inProgress.push(task);
      if (task.status === 'feedback') this.feedback.push(task);
    })
    // console.log(this.todo)
}

  filterTasksByCharacters(value: string) {
    this.clearBoard()
    this.tasks.filter((task) => {
      if (task.status === 'todo' && task.title.toLowerCase().includes(value.toLowerCase()) || task.status === 'todo' && task.description.toLowerCase().includes(value.toLowerCase())) this.todo.push(task);
      if (task.status === 'done' && task.title.toLowerCase().includes(value.toLowerCase()) || task.status === 'done' && task.description.includes(value.toLowerCase())) this.done.push(task);
      if (task.status === 'inProgress' && task.title.toLowerCase().includes(value.toLowerCase()) || task.status === 'inProgress' && task.description.toLowerCase().includes(value.toLowerCase())) this.inProgress.push(task);
      if (task.status === 'feedback' && task.title.toLowerCase().includes(value.toLowerCase()) || task.status === 'feedback' && task.description.toLowerCase().includes(value.toLowerCase())) this.feedback.push(task);
    })
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
      await updateDoc(this.authService.getSingleRefDoc('tasks', task.id), {
        assignedUsers: task.assignedUsers,
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

    async updateTaskCategory(task: Task) {
      await updateDoc(this.authService.getSingleRefDoc('tasks', task.id), {
        status: task.status
      })
    }

    async deleteTask(task: Task) {
      await deleteDoc(this.authService.getSingleRefDoc('tasks', task.id))
    }

  }
  

