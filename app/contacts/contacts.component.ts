import { Component, OnDestroy, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewContactComponent } from './new-contact/new-contact.component';
import { ContactService } from 'src/services/contact.service';
import { Contact } from '../interfaces/contact';
import { Subscription } from 'rxjs';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  authService: any;
  currentUserContacts: any;
  contactsSubscription: Subscription | null = null;

  firstLetters: any[] = [];
  renderedLetters = new Set<string>();
  contactsByFirstLetter: any;
  showConfirmation: boolean = false;
  alreadyRenderedLetters: string[] = [];
  initials: any[] = [];

  mobileView: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  constructor(private dialog: MatDialog, public contactService: ContactService, private router: Router) { }

  async ngOnInit() {
    this.checkScreenSize();
    this.contactsSubscription = this.contactService.getContactsForCurrentUser()
      .subscribe((contacts) => {
        this.currentUserContacts = contacts;
        this.groupContactsByInitial();
      });
  }

  ngOnDestroy() {
    this.contactsSubscription?.unsubscribe();
    if (this.router.url !== '/contacts') this.contactService.showDetails = false;
  }

  /**
   * Checks the screen size to determine if the view is in mobile mode.
   */
  checkScreenSize() {
    if (window.innerWidth < 1200) this.mobileView = true;
    else this.mobileView = false;
  }

  /**
   * Sorts an array of initials alphabetically.
   * @param {string[]} initials - The array of initials to be sorted.
   */
  sortInitials(initials: string[]) {
    initials.sort((a: string, b: string) => {
      return a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0;
    });
  }

  /**
   * Groups contacts by their initial letters.
   */
  groupContactsByInitial() {
    const groupedContacts: any = [];
    const initials: any = [];
    this.currentUserContacts.forEach((contact: { name: string; }) => {
      const initial = contact.name.charAt(0).toUpperCase();
      if (groupedContacts[initial]) {
        groupedContacts[initial].push(contact);
      } else {
        groupedContacts[initial] = [contact];
        initials.push(initial);
      }
    });
    this.sortInitials(initials);
    this.initials = initials;
    this.currentUserContacts = groupedContacts;
  }

  /**
   * Opens the dialog to add a new contact.
   */
  openAddNewContactDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'dialog-style';
    this.dialog.closeAll();
    this.dialog.open(NewContactComponent, dialogConfig);
  }

  /**
   * Opens the dialog to edit a contact.
   * @param {Contact} contact - The contact to be edited.
   */
  openEditContactDialog(contact: Contact) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'dialog-style';
    dialogConfig.data = {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      color: contact.color,
      uid: contact.uid,
      currentUserContacts: this.currentUserContacts
    };
    this.dialog.closeAll();
    this.dialog.open(EditContactComponent, dialogConfig);
  }

  /**
   * Shows the details of a contact.
   * @param {Contact} contact - The contact for which to display details.
   */
  showContactDetails(contact: Contact) {
    this.contactService.selectedContact = contact;
    this.contactService.showDetails = true;
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
   * Deletes a contact.
   * @param {Contact} contact - The contact to be deleted.
   */
  deleteContact(contact: Contact) {
    this.contactService.deleteContact(contact);
    this.contactService.showDetails = false;
  }
}


