import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/interfaces/task';
import { AuthenticationService } from 'src/services/authentication.service';
import { ContactService } from 'src/services/contact.service';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  showAssignDropDown: boolean = false;
  showEditMode: boolean = false;
  editTitle: string = '';
  currentUserContacts: any;
  contactInput: string = '';
  selectedContacts: any;
  subtaskFocused: boolean = false;
  subtask: string = '';
  editedSubtask: string = '';
  showSubtaskIcons: boolean = false;

  allContacts: any;

  taskObject: any;
  today: string;

  constructor(private dialog: MatDialog,
    private taskService: TaskService,
    public contactService: ContactService,
    public authService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public taskData: any) {
    this.today = new Date().toISOString().split('T')[0];
  }

  markUser(uid: string) {
    return this.taskObject.assignedUsers.some((user: { uid: string; }) => user.uid === uid);
  }

  changeDateFormat() {
    let dueDateInMilliseconds = Date.parse(this.taskObject.dueDate);
    let date = new Date(dueDateInMilliseconds).toLocaleDateString('de-DE');
    return date.replaceAll('.', '/');
  }

  ngOnInit() {
    this.taskObject = this.taskData;
    // console.log(this.taskObject);
    this.contactService.getContactsForCurrentUser()
      .subscribe((contacts) => {
        this.allContacts = contacts;
      });
  }

  checkSubtask(subtask: any) {
    subtask.done = !subtask.done;
    this.taskService.updateTask(this.taskObject);
  }

  close() {
    this.dialog.closeAll();
  }

  setPriority(priority: string) {
    this.taskData.prio = priority;
  }

  getInitials(name: string) {
    let initials = name.split(' ').map(word => word.charAt(0)).join('');
    return initials;
  }

  activateEditMode() {
    this.showEditMode = true;
  }

  toggleDropdown(dropDownName: string) {
    if (dropDownName === 'assign') this.showAssignDropDown = !this.showAssignDropDown;
  }

  filterContacts(name: string) {
    if (name.trim() !== '') {
      let filtered = this.allContacts.filter((contact: { name: string; }) => contact.name.trim().toLowerCase().startsWith(name.trim().toLowerCase()));
      let newArr = filtered;
      this.contactService.currentUserContacts = newArr;
    }
    else {
      this.contactService.getContactsForCurrentUser()
        .subscribe((contacts) => {
          this.contactService.currentUserContacts = contacts;
        });
    }
  }

  selectContact(event: any, selectedContact: any) {
    if (event.target.checked) {
      this.taskObject.assignedUsers.push(selectedContact);
    }
    else {
      let index = this.taskObject.assignedUsers.findIndex((contact: { uid: string; }) => contact.uid === selectedContact.uid);
      this.taskObject.assignedUsers.splice(index, 1);
    }
  }

  contactIsAssigned(contact: any) {
    if (this.taskObject.assignedUsers.includes((user: { uid: string; }) => user.uid == contact.uid)) return true;
    else return false;
  }

  deleteSubtask(subtask: string) {
    let index = this.taskData.subtasks.indexOf((subtask));
    this.taskData.subtasks.splice(index, 1);
  }

  openEditInput(subtask: any) {
    let index = this.taskData.subtasks.indexOf(subtask);
    this.taskData.subtasks[index].editMode = true;
    this.editedSubtask = subtask.name;
  }

  updateSubtask(subtask: any, updatedSubtask: string) {
    let index = this.taskData.subtasks.findIndex((task: { name: string; }) => task.name === subtask.name);
    this.taskData.subtasks[index].name = updatedSubtask;
    this.taskData.subtasks[index].editMode = false;
    console.log(this.taskData.subtasks);
  }

  clearSubtaskInput() {
    this.subtaskFocused = false;
    this.subtask = '';
  }

  addSubtask() {
    let subtask = {
      name: this.subtask.trim(),
      editMode: false
    };
    if (this.subtask.trim() != '' && this.taskData.subtasks.length < 2) {
      this.taskData.subtasks.push(subtask);
      this.subtask = '';
      console.log(this.taskData.subtasks);
    }
  }

  saveChanges() {
    this.taskService.updateTask(this.taskObject);
    this.dialog.closeAll();
  }

  deleteTask() {
    this.taskService.deleteTask(this.taskObject);
    this.dialog.closeAll();
  }

}


