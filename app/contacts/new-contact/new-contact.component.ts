import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { collection, updateDoc } from "firebase/firestore"; 
import { Contact } from 'src/app/interfaces/contact';
import { ContactService } from 'src/services/contact.service';


@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.scss']
})
export class NewContactComponent {

  name:string = '';
  email:string = '';
  phone:number | undefined;
  
  constructor(private dialog: MatDialog, private contactService: ContactService) {}

  closeDialog() {
    this.dialog.closeAll();
  }

  async addContact(){
    const contact: Contact = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      uid: this.generateRandomId(),
      color: this.getRandomColorHex()
    }
     this.contactService.addContact(contact);
     this.closeDialog();
  }

   generateRandomId(): string {
    const length = 28;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }
    return randomId;
  }

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
  
  
}
