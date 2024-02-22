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

  getContactsForCurrentUser(): Observable<any> {
    return new Observable((observer) => {
      this.getDocId().then(() => {
        const docRef = this.auth.getSingleRefDoc('users', this.currentUserDocId);

        onSnapshot(docRef, snapshot => {
          console.log('onSnapshot wurde aufgerufen');

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

  async deleteContact(contact: Contact | undefined) {
    await updateDoc(this.auth.getSingleRefDoc('users', this.currentUserDocId), {
      contacts: arrayRemove(contact)
    });
  }

  async editContact(contactArr: any[]) {
    await updateDoc(this.auth.getSingleRefDoc('users', this.currentUserDocId), {
      contacts: contactArr
    });
  }

  async addContact(contact: Contact) {
    await updateDoc(this.auth.getSingleRefDoc('users', this.currentUserDocId), {
      contacts: arrayUnion(contact)
    });
  }

}