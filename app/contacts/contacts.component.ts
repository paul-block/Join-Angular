import { Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewContactComponent } from './new-contact/new-contact.component';
import { ContactService } from 'src/services/contact.service';
import { Contact } from '../interfaces/contact';
import { Subscription } from 'rxjs';
import { EditContactComponent } from './edit-contact/edit-contact.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  authService: any;
  currentUserContacts: any[] = [];
  contactsSubscription: Subscription | null = null;

  showDetails:boolean = false
  selectedContact!: Contact;


  constructor(private dialog: MatDialog, public contactService: ContactService) {}

  ngOnInit() {
    this.contactsSubscription = this.contactService.getContactsForCurrentUser()
    .subscribe((contacts) =>{
      this.currentUserContacts = contacts;
    })
  }

  ngOnDestroy() {
    this.contactsSubscription?.unsubscribe();
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
      currentUserContacts: this.currentUserContacts
    }
    this.dialog.closeAll();
    this.dialog.open(EditContactComponent, dialogConfig);
  }

  showContactDetails(contact: Contact) {
    this.showDetails = true;
    this.contactService.selectedContact = contact;
  }
  
  getInitials(name: string) {
    let initials = name.split(' ').map(word => word.charAt(0)).join('');
    return initials.toUpperCase();
  }

  deleteContact(contact: Contact) {
    this.contactService.deleteContact(contact);
    this.showDetails = false;
  }
}
