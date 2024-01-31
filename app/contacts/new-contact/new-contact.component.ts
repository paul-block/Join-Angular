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
      phone: this.phone
    }
     this.contactService.addContact(contact);
     this.closeDialog();
  }



}
