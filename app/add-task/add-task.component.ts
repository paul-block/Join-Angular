import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication.service';
import { ContactService } from 'src/services/contact.service';
import { TaskService } from 'src/services/task.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  title: string = '';
  description: string = '';
  contactInput: string = '';
  // assignableUsers: any[] = this.getContacts();
  dueDate: string = '';
  prio: string = '';
  category: string = '';
  subtask: string = '';

  showAssignDropDown:boolean = false;
  showCategoryDropDown:boolean = false;
  subtaskFocused:boolean = false;

  selectableCategories: string[] = ['Technical Task', 'User Story']
  selectedContacts: any[] = [];
  addedSubtasks: any[] = [];

  editedSubtask: string = '';

  currentUserContacts:any;
  contactsSubscription: Subscription | null = null;
  today:string;

  addedTask:boolean = false;
  showConfirmation:boolean = false;

  constructor(private taskService: TaskService, private router: Router, public authService: AuthenticationService, public contactService: ContactService){
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit(){
    this.contactsSubscription = this.contactService.getContactsForCurrentUser()
    .subscribe((contacts) =>{
      this.currentUserContacts = contacts;
    })
    setTimeout(() => {
      this.showConfirmation = true;
    }, 4000);
  }

  // changeDateFormat() {
  //   let dueDateInMilliseconds = Date.parse(this.dueDate);
  //   // let dueDateInCorrectFormat = new Date(dueDateInMilliseconds).toLocaleDateString('de-DE');
  //   return dueDateInMilliseconds;
  // }

  createTaskObject() {
    let selectedUsersId = this.selectedContacts.map((contact) => contact.uid);
    const task = {
      assignedUserIDs: selectedUsersId,
      assignedUsers: this.selectedContacts,
      category: this.category,
      description: this.description,
      dueDate: Date.parse(this.dueDate),
      prio: this.prio,
      status: 'todo',
      subtasks: this.addedSubtasks,
      title: this.title,
    }
    return task;
  }

  setPriority(priority:string) {
    this.prio = '';
    this.prio = priority;
  }

  async addTask() {
    this.addedTask = true;
    this.selectedContacts.push(this.authService.userData);
    await this.taskService.addTask(this.createTaskObject());
    this.clearTask();
    this.router.navigate(['/board']);

  }

  clearTask() {
    this.title = '';
    this.description= '';
    this.contactInput= '';
    this.dueDate= '';
    this.prio= '';
    this.category = '';
    this.subtask= '';
    this.selectedContacts = [];
  }
  
  addSubtask() {
    let subtask = {
      name: this.subtask.trim(),
      editMode: false,
      done: false
    }
    if (this.subtask.trim() != '' && this.addedSubtasks.length < 2) {
      this.addedSubtasks.push(subtask)
      this.subtask = '';
      console.log(this.addedSubtasks)
    }
  }

  deleteSubtask(subtask:string) {
    let index = this.addedSubtasks.indexOf((subtask))
    this.addedSubtasks.splice(index, 1);
  }

  openEditInput(subtask: any){
  let index = this.addedSubtasks.indexOf(subtask);
  this.addedSubtasks[index].editMode = true;
  this.editedSubtask = subtask.name;
  }

  updateSubtask(subtask:any, updatedSubtask: string){
    let index = this.addedSubtasks.findIndex(task => task.name === subtask.name);
    this.addedSubtasks[index].name = updatedSubtask;
    this.addedSubtasks[index].editMode = false;
    console.log(this.addedSubtasks);
  }

  clearSubtaskInput() {
    this.subtaskFocused = false;
    this.subtask = '';
  }

  toggleDropdown(dropDownName: string) {
    if (dropDownName === 'assign') this.showAssignDropDown =! this.showAssignDropDown;
    if (dropDownName === 'category') this.showCategoryDropDown =! this.showCategoryDropDown;
  }

  selectContact(event:any, selectedContact:any) {
    if (event.target.checked) {
      selectedContact.marked = true;
      this.selectedContacts.push(selectedContact);
    }
    else {
      let index = this.selectedContacts.findIndex(contact => contact.name === selectedContact.name)
      this.selectedContacts[index].marked = false;
      this.selectedContacts.splice(index, 1)
    }
  }

  selectCategory(category:string) {
    this.category = category;
    this.showCategoryDropDown = false;
  }
  
  getInitials(name: string) {
    let initials = name.split(' ').map(word => word.charAt(0)).join('');
    return initials
  }

  // getContacts() {
  //   return this.authService.contacts;
  // }

  filterContacts(name: string) {
    if (name.trim() !== '') {
      let filteredContacts = this.currentUserContacts.filter((contact: { name: string; }) => contact.name.toLowerCase().startsWith(name.trim().toLowerCase()));
      this.currentUserContacts = filteredContacts;
      console.log(filteredContacts)
      console.log('filtered contacts')
    }
    else {
     this.contactService.getContactsForCurrentUser()
      .subscribe((contacts) =>{
        this.currentUserContacts = contacts;
      })
    }   
}
}