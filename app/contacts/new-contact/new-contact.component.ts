import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  name: string = '';
  email: string = '';
  phone: number | undefined;

  constructor(private dialog: MatDialog, private contactService: ContactService) { }

  /**
   * Adds a new contact.
   * @param {NgForm} form - The form containing the contact data.
   */
  async addContact(form: NgForm) {
    if (form.valid) {
      const contact: Contact = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        uid: this.generateRandomId(),
        color: this.getRandomColorHex()
      };
      this.contactService.addContact(contact);
      this.contactService.selectedContact = contact;
      this.closeDialog();
      this.contactService.showDetails = true;
      this.showContactAddedConfirmation();
    }
  }

  /**
   * Closes the dialog.
   */
  closeDialog() {
    this.dialog.closeAll();
  }

  /**
   * Shows the contact added confirmation message.
   */
  showContactAddedConfirmation() {
    this.contactService.showContactAddedConfirmation = true;
    setTimeout(() => {
      this.contactService.showContactAddedConfirmation = false;
    }, 1500);
  }

  /**
   * Generates a random ID.
   * @returns {string} The generated random ID.
   */
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

  /**
   * Gets a random color hex code.
   * @returns {string} The randomly selected color hex code.
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

}
