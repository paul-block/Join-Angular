import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Contact } from 'src/app/interfaces/contact';
import { ContactService } from 'src/services/contact.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent implements OnInit {
  name:string = '';
  email:string = '';
  phone?:number;

  currentDetailsBeforeEdit: Contact = this.saveCurrentContactDetailsLocal();

  currentContactArrayFirestore:any[] = [];
  
  constructor(private dialog: MatDialog,
              private contactService: ContactService,
              @Inject(MAT_DIALOG_DATA) public contactData: any){}

  ngOnInit() {
    this.setDataIntoInputs();
    this.saveCurrentContactArrayLocal();
    this.saveCurrentContactDetailsLocal()
    console.log(this.currentDetailsBeforeEdit)
  }

  saveCurrentContactDetailsLocal() {
    return {
      name: this.contactData.name,
      email: this.contactData.email,
      phone: this.contactData.phone
    }
  }

  saveCurrentContactArrayLocal(){
    this.currentContactArrayFirestore = this.contactData.currentContactArrayFirestore;
  }

  setDataIntoInputs(){
    this.name = this.contactData.name;
    this.email = this.contactData.email;
    this.phone = this.contactData.phone;
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  editContact() {
    let editedContact: Contact = {
      name: this.name,
      email: this.email,
      phone: this.phone
    }

    let index = this.currentContactArrayFirestore.findIndex(contact => this.currentDetailsBeforeEdit.email === contact.email);
    this.currentContactArrayFirestore[index] = editedContact;



    console.log(editedContact);
    console.log(this.currentDetailsBeforeEdit)
    this.contactService.editContact(this.currentContactArrayFirestore)
    this.contactService.selectedContact = editedContact;
    this.closeDialog()
  }

}
