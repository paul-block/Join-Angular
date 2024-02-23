import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Contact } from 'src/app/interfaces/contact';
import { arrayRemove, arrayUnion, getDoc, onSnapshot, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  currentUserDocId: string = '';
  selectedContact!: Contact;
  currentUserContacts: any;
  contactsSubscription: any;

  showContactAddedConfirmation: boolean = false;
  showDetails: boolean = false;

  constructor(private auth: AuthenticationService) {
    this.contactsSubscription = this.getContactsForCurrentUser()
      .subscribe((contacts) => {
        this.currentUserContacts = contacts;
      });
  }

  /**
   * Retrieves the document ID for the current user from Firestore.
   * @returns {Promise<void>} A promise that resolves when the document ID is retrieved.
   */
  getDocId() {
    return new Promise<void>((resolve, reject) => {
      const q = query(this.auth.getUsersRef(), where('uid', '==', this.auth.userData.uid));
      onSnapshot(q, doc => {
        doc.forEach(doc => {
          this.currentUserDocId = doc.id;
        });
        resolve();
      }, error => {
        console.error('Fehler beim Abrufen der Aufgaben: ', error);
        reject(error);
      });
    });
  }

  /**
   * Retrieves contacts for the current user from Firestore.
   * @returns {Observable<any>} An observable that emits the contacts data.
   */
  getContactsForCurrentUser(): Observable<any> {
    return new Observable((observer) => {
      this.getDocId().then(() => {
        const docRef = this.auth.getSingleRefDoc('users', this.currentUserDocId);

        onSnapshot(docRef, snapshot => {

          if (snapshot.exists()) {
            const docData = snapshot.data();
            const extractedData = docData["contacts"];
            observer.next(extractedData);
          } else {
            console.log("No such document!");
            observer.error("No such document!");
          }
        }, error => {
          console.error('Fehler beim Abrufen des Dokuments: ', error);
          observer.error(error);
        });

      }).catch(error => {
        console.error('Fehler beim Abrufen der Document ID: ', error);
        observer.error(error);
      });
    });
  }

  /**
   * Deletes a contact from Firestore for the current user.
   * @param {Contact | undefined} contact - The contact to be deleted.
   * @returns {Promise<void>} A promise that resolves when the contact is deleted.
   */
  async deleteContact(contact: Contact | undefined) {
    await updateDoc(this.auth.getSingleRefDoc('users', this.currentUserDocId), {
      contacts: arrayRemove(contact)
    });
  }

  /**
   * Edits contacts for the current user in Firestore.
   * @param {any[]} contactArr - The array of contacts to be edited.
   * @returns {Promise<void>} A promise that resolves when contacts are edited.
   */
  async editContact(contactArr: any[]) {
    await updateDoc(this.auth.getSingleRefDoc('users', this.currentUserDocId), {
      contacts: contactArr
    });
  }

  /**
   * Adds a contact to Firestore for the current user.
   * @param {Contact} contact - The contact to be added.
   * @returns {Promise<void>} A promise that resolves when the contact is added.
   */
  async addContact(contact: Contact) {
    await updateDoc(this.auth.getSingleRefDoc('users', this.currentUserDocId), {
      contacts: arrayUnion(contact)
    });
  }

}