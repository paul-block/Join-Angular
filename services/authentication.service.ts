import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, getDocs, where, query, onSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser:any;
  uid: string | undefined;
  userData: any;
  unsubTaskList: any;

  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  isLoggedIn = false;


  constructor(private router: Router) {
    this.checkLocalStorageUserData();
  }

  checkLocalStorageUserData(){
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData && storedUserData !== 'null') {
      this.userData = JSON.parse(storedUserData);
      console.log('User data',this.userData);
      this.isLoggedIn = true;
    }
  }

  signIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then(async userCredential => {
        this.uid = userCredential.user.uid;
        console.log(this.uid);
        this.userData = await this.getUserData(userCredential.user.uid);
        localStorage.setItem('userData', JSON.stringify(this.userData)); 
        this.isLoggedIn = true;
        this.router.navigate(['/summary']);
        // this.getUserTasks(this.uid);
      })
      .catch(error => {
        console.error('SignIn Failed:', error);
      });
  }

  signUp(email: string, password: string, username: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: username
        };
        this.userData = userData;
        this.addUserToFirestore(userData);
        this.router.navigate(['']);
      })
      .catch(error => {
        console.error('SignUp Failed:', error.message, error.code);
      });
  }

  signOut() {
    signOut(this.auth).then(() => {
      this.uid = undefined;
      this.userData = null;
      localStorage.setItem('userData', 'null');
      this.isLoggedIn = false;
      this.router.navigate(['']);
    });
  }
  
  async getUserData(userId:any) {
    const q = query(this.getUsersRef(), where('uid', '==', userId));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const userData = doc.data();
        return userData;
      } else {
        console.log('Kein passendes Dokument gefunden!');
        return null;
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Dokumente: ', error);
      return null
    }
  }

  getUsernameByUserId(id: string) {
    const q = query(this.getUsersRef(), where('uid', '==', id))
    
    onSnapshot(q, doc => {
      doc.forEach( user => {
       const userData = user.data();
        return userData["name"]
      })
    })
  
  }

  // getUserTasks(userId: string) {
  //   const q = query(this.getTasksRef(), where('assignedUsers', '==', userId));
  
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     if (!querySnapshot.empty) {
  //       const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //       console.log('Aufgaben gefunden:', tasks);
  //     } else {
  //       console.log('Keine Aufgaben gefunden!');
  //     }
  //   }, (error) => {
  //     console.error('Fehler beim Abrufen der Aufgaben: ', error);
  //   });
  // 
  //   // Optional: Rückgabe der Unsubscribe-Funktion, um das Abhören zu beenden
  //   return unsubscribe;
  // }
  
  
  addUserToFirestore(data:any) {
    addDoc(this.getUsersRef(), data);
  }


  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  getTasksRef() {
    return collection(this.firestore, 'tasks');
  }

  getSingleRefDoc(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

}
