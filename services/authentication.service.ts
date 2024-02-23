import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, getDocs, where, query, onSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser: any;
  uid: string | undefined;
  userData: any;
  greetingLoaded: boolean = false;

  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  isLoggedIn = false;

  constructor(private router: Router) {
    this.checkLocalStorageUserData();
  }

  /**
   * Checks if user data exists in local storage and sets user authentication status accordingly.
   */
  checkLocalStorageUserData() {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData && storedUserData !== 'null') {
      this.userData = JSON.parse(storedUserData);
      this.isLoggedIn = true;
    }
  }

  /**
   * Signs in a user with the provided email and password.
   * If successful, sets user data in local storage, updates authentication status, and navigates to the summary page.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   */
  signIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then(async userCredential => {
        this.uid = userCredential.user.uid;
        this.userData = await this.getUserData(userCredential.user.uid);
        localStorage.setItem('userData', JSON.stringify(this.userData));
        this.isLoggedIn = true;
        this.router.navigate(['/summary']);
      })
      .catch(error => {
        console.error('SignIn Failed:', error);
      });
  }

  /**
   * Signs in a user as a guest.
   * If successful, sets user data in local storage, updates authentication status, and navigates to the summary page.
   */
  guestSignIn() {
    signInWithEmailAndPassword(this.auth, 'guest@guest.de', 'Guest123!')
      .then(async userCredential => {
        this.uid = userCredential.user.uid;
        this.userData = await this.getUserData(userCredential.user.uid);
        localStorage.setItem('userData', JSON.stringify(this.userData));
        this.isLoggedIn = true;
        this.router.navigate(['/summary']);
      })
      .catch(error => {
        console.error('SignIn Failed:', error);
      });
  }

  /**
   * Signs up a new user with the provided email, password, and username.
   * If successful, sets user data in local storage, adds user to Firestore, and navigates to the home page.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @param {string} username - The user's username.
   */
  signUp(email: string, password: string, username: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: username,
          color: this.getRandomColorHex(),
          contacts: []
        };
        this.userData = userData;
        this.addUserToFirestore(userData);
        this.router.navigate(['']);
      })
      .catch(error => {
        console.error('SignUp Failed:', error.message, error.code);
      });
  }

  /**
   * Signs out the current user.
   * Clears user data from local storage, updates authentication status, and navigates to the home page.
   */
  signOut() {
    signOut(this.auth).then(() => {
      this.uid = undefined;
      this.userData = null;
      localStorage.setItem('userData', 'null');
      localStorage.setItem('greetingLoaded', 'false');
      this.isLoggedIn = false;
      this.router.navigate(['']);
    });
  }

  /**
   * Retrieves user data from Firestore based on the user ID.
   * @param {any} userId - The user's ID.
   * @returns {Promise<any>} A promise resolving to the user data.
   */
  async getUserData(userId: any) {
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
      return null;
    }
  }

  /**
   * Retrieves the username by user ID from Firestore.
   * @param {string} id - The user's ID.
   * @returns {string} The username.
   */
  getUsernameByUserId(id: string) {
    const q = query(this.getUsersRef(), where('uid', '==', id));
    onSnapshot(q, doc => {
      doc.forEach(user => {
        const userData = user.data();
        return userData["name"];
      });
    });
  }


  /**
   * Generates a random color hex code.
   * @returns {string} A random color hex code.
   */
  getRandomColorHex(): string {
    const colors = [
      '#3498db',
      '#e74c3c',
      '#f39c12',
      '#2ecc71',
      '#f1c40f',
      '#9b59b6',
      '#1abc9c',
      '#e5e8df'
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  /**
   * Adds user data to Firestore.
   * @param {any} data - The user data to be added.
   */
  addUserToFirestore(data: any) {
    addDoc(this.getUsersRef(), data);
  }

  /**
   * Gets the reference to the 'users' collection in Firestore.
   * @returns {CollectionReference<DocumentData>} The reference to the 'users' collection.
   */
  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  /**
   * Gets the reference to the 'tasks' collection in Firestore.
   * @returns {CollectionReference<DocumentData>} The reference to the 'tasks' collection.
   */
  getTasksRef() {
    return collection(this.firestore, 'tasks');
  }

  /**
   * Gets a reference to a single document in a collection in Firestore.
   * @param {string} colId - The ID of the collection.
   * @param {string} docId - The ID of the document.
   * @returns {DocumentReference<DocumentData>} The reference to the specified document.
   */
  getSingleRefDoc(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

}
