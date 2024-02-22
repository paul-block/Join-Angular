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
  name: string = '';
  email: string = '';
  phone?: number;

  contactObjectBeforeEdit: Contact = this.saveCurrentContactDetails();

  contactsSubscription: any;
  currentUserContacts: any[] = [];

  constructor(private dialog: MatDialog,
    private contactService: ContactService,
    @Inject(MAT_DIALOG_DATA) public contactData: any) { }

  ngOnInit() {
    this.setDataIntoInputs();
    this.saveCurrentContactDetails();
    this.contactsSubscription = this.contactService.getContactsForCurrentUser()
      .subscribe((contacts) => {
        this.currentUserContacts = contacts;
      });
  }

  saveCurrentContactDetails() {
    return {
      name: this.contactData.name,
      email: this.contactData.email,
      phone: this.contactData.phone,
      uid: this.contactData.uid,
      color: this.contactData.color
    };
  }

  setDataIntoInputs() {
    this.name = this.contactData.name;
    this.email = this.contactData.email;
    this.phone = this.contactData.phone;
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  deleteContact() {
    let index = this.currentUserContacts.findIndex((contact: { uid: string; }) => this.contactData.uid === contact.uid);
    let contact = this.currentUserContacts[index];
    this.contactService.deleteContact(contact);
    this.contactService.showDetails = false;
    this.closeDialog();
  }

  editContact(form: NgForm) {
    if (form.valid) {
      let editedContact: Contact = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        uid: this.contactData.uid,
        color: this.contactData.color
      };
      let index = this.currentUserContacts.findIndex((contact: { uid: string; }) => this.contactObjectBeforeEdit.uid === contact.uid);
      this.currentUserContacts[index] = editedContact;
      this.contactService.editContact(this.currentUserContacts);
      this.contactService.selectedContact = editedContact;
      this.closeDialog();
    }
  }

}
