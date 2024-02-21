import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  contactObjectBeforeEdit: Contact = this.saveCurrentContactDetails();

  // currentContactArray:any[] = [];
  contactsSubscription: any;
  currentUserContacts: any[] = [];
  
  constructor(private dialog: MatDialog,
              private contactService: ContactService,
              @Inject(MAT_DIALOG_DATA) public contactData: any){}

  ngOnInit() {
    this.setDataIntoInputs();
    // this.saveCurrentContactArrayLocal();
    this.saveCurrentContactDetails()
    this.contactsSubscription = this.contactService.getContactsForCurrentUser()
    .subscribe((contacts) =>{
      this.currentUserContacts = contacts;
    })
    // console.log(this.currentContactArray)
  }

  saveCurrentContactDetails() {
    return {
      name: this.contactData.name,
      email: this.contactData.email,
      phone: this.contactData.phone,
      uid: this.contactData.uid,
      color: this.contactData.color
    }
  }

  // saveCurrentContactArrayLocal(){
  //   this.currentContactArray = this.contactData.currentUserContacts;
  // }

  setDataIntoInputs(){
    this.name = this.contactData.name;
    this.email = this.contactData.email;
    this.phone = this.contactData.phone;
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  editContact(form: NgForm) {
    if (form.valid) {
    let editedContact: Contact = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      uid: this.contactData.uid,
      color: this.contactData.color
    }

    let index = this.currentUserContacts.findIndex((contact: { uid: string; }) => this.contactObjectBeforeEdit.uid === contact.uid);
    this.currentUserContacts[index] = editedContact;
    console.log('index: ' + index);
    console.log(this.currentUserContacts[index])
    console.log('editedContact: ' + editedContact);
    console.log('contactObjectBeforeEdit: ' + this.contactObjectBeforeEdit)
    this.contactService.editContact(this.currentUserContacts)
    this.contactService.selectedContact = editedContact;
    this.closeDialog()
  } 
}
  
}
