import { Injectable, inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Firestore, addDoc, collection, doc, getDocs, onSnapshot, query, where } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks:any[] = [];
  unsubList:any;

  // private firestore: Firestore = inject(Firestore);

  constructor(private authService: AuthenticationService) {
  }

  // async getUserTasks() {
  //   try {
  //     if (this.authService.userData.uid !== undefined) {
  //       const querySnapshot = await getDocs(query(this.authService.getTasksRef(), where('assignedUsers', 'array-contains', this.authService.userData.uid)));
  //       this.tasks = querySnapshot.docs.map(doc => doc.data());
  //     }
  //   } catch (err) {
  //     console.error('Error fetching tasks:', err);
  //   }
  // }

  getUserTasks() {
       onSnapshot(this.authService.getTasksRef(), (task) => {
        console.log(task);
      })
      }
    }

  

