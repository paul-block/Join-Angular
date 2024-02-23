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
    public contactService: ContactService,
    @Inject(MAT_DIALOG_DATA) public contactData: any) { }

  ngOnInit() {
    this.setDataIntoInputs();
    this.saveCurrentContactDetails();
    this.contactsSubscription = this.contactService.getContactsForCurrentUser()
      .subscribe((contacts) => {
        this.currentUserContacts = contacts;
      });
  }

  /**
   * Saves the current contact details.
   * @returns {Object} The current contact details.
   */
  saveCurrentContactDetails() {
    return {
      name: this.contactData.name,
      email: this.contactData.email,
      phone: this.contactData.phone,
      uid: this.contactData.uid,
      color: this.contactData.color
    };
  }

  /**
   * Sets data into the input fields.
   */
  setDataIntoInputs() {
    this.name = this.contactData.name;
    this.email = this.contactData.email;
    this.phone = this.contactData.phone;
  }

  /**
   * Gets the initials from a name in uppercase.
   * @param {string} name - The name from which to extract initials.
   * @returns {string} The initials extracted from the name in uppercase.
   */
  getInitials(name: string) {
    let initials = name.split(' ').map(word => word.charAt(0)).join('');
    return initials.toUpperCase();
  }

  /**
   * Closes the dialog.
   */
  closeDialog() {
    this.dialog.closeAll();
  }

  /**
   * Deletes the contact.
   */
  deleteContact() {
    let index = this.currentUserContacts.findIndex((contact: { uid: string; }) => this.contactData.uid === contact.uid);
    let contact = this.currentUserContacts[index];
    this.contactService.deleteContact(contact);
    this.contactService.showDetails = false;
    this.closeDialog();
  }

  /**
   * Edits the contact.
   * @param {NgForm} form - The form containing the contact data.
   */
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
