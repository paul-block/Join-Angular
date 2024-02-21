import { Component, OnDestroy, HostListener, OnInit} from '@angular/core';
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
  currentUserContacts:any;
  contactsSubscription: Subscription | null = null;

  firstLetters:any[] = [];
  renderedLetters = new Set<string>();
  contactsByFirstLetter:any;
  showConfirmation:boolean = false;
  alreadyRenderedLetters: string[] = [];
  initials: any[] = [];

  mobileView: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize()
  }

  constructor(private dialog: MatDialog, public contactService: ContactService, private router: Router) {}

  async ngOnInit() {
    this.checkScreenSize();
    this.contactsSubscription = this.contactService.getContactsForCurrentUser()
    .subscribe((contacts) =>{
      this.currentUserContacts = contacts;
      this.groupContactsByInitial();
    })
  }

  ngOnDestroy() {
    this.contactsSubscription?.unsubscribe();
    if(this.router.url !== '/contacts') this.contactService.showDetails = false;
  }

  checkScreenSize() {
    if (window.innerWidth < 1200) this.mobileView = true;
    else this.mobileView = false;
  }

  sortInitials(initials: string[]) {
    initials.sort((a: string,b: string) => {
     return a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0;
    })
  }

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

  openAddNewContactDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass ='dialog-style';
    this.dialog.closeAll();
    this.dialog.open(NewContactComponent, dialogConfig);
  }

  openEditContactDialog(contact: Contact){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass ='dialog-style';
    dialogConfig.data = {
      name: contact.name,
      email:contact.email,
      phone:contact.phone,
      color: contact.color,
      uid: contact.uid,
      currentUserContacts: this.currentUserContacts
    }
    this.dialog.closeAll();
    this.dialog.open(EditContactComponent, dialogConfig);
  }

  showContactDetails(contact: Contact) {
    this.contactService.selectedContact = contact;
    this.contactService.showDetails = true;
  }

  getInitials(name: string) {
    let initials = name.split(' ').map(word => word.charAt(0)).join('');
    return initials.toUpperCase();
  }

  deleteContact(contact: Contact) {
    this.contactService.deleteContact(contact);
    this.contactService.showDetails = false;
  }
}


