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
  titleValidationErr: boolean = false;
  dateValidationErr: boolean = false;

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

  ngOnInit() {
    this.taskObject = this.taskData;
    this.contactService.getContactsForCurrentUser()
      .subscribe((contacts) => {
        this.allContacts = contacts;
      });
  }

  /**
   * Checks if a user is marked as assigned to the task.
   * @param {string} uid - The user ID to check.
   * @returns {boolean} True if the user is assigned, false otherwise.
   */
  markUser(uid: string) {
    return this.taskObject.assignedUsers.some((user: { uid: string; }) => user.uid === uid);
  }

  /**
   * Changes the date format to 'dd/mm/yyyy'.
   * @returns {string} The date in 'dd/mm/yyyy' format.
   */
  changeDateFormat() {
    let dueDateInMilliseconds = Date.parse(this.taskObject.dueDate);
    let date = new Date(dueDateInMilliseconds).toLocaleDateString('de-DE');
    return date.replaceAll('.', '/');
  }

  /**
   * Checks or unchecks a subtask and updates the task accordingly.
   * @param {any} subtask - The subtask to check or uncheck.
   */
  checkSubtask(subtask: any) {
    subtask.done = !subtask.done;
    this.taskService.updateTask(this.taskObject);
  }

  /**
   * Closes the dialog.
   */
  close() {
    this.dialog.closeAll();
  }

  /**
   * Sets the priority of the task.
   * @param {string} priority - The priority value to be set.
   */
  setPriority(priority: string) {
    this.taskData.prio = priority;
  }

  /**
   * Gets the initials from a name.
   * @param {string} name - The name from which to extract initials.
   * @returns {string} The initials extracted from the name.
   */
  getInitials(name: string) {
    let initials = name.split(' ').map(word => word.charAt(0)).join('');
    return initials;
  }

  /**
   * Activates the edit mode.
   */
  activateEditMode() {
    this.showEditMode = true;
  }

  /**
   * Toggles dropdown visibility.
   */
  toggleDropdown() {
    this.showAssignDropDown = !this.showAssignDropDown;
  }

  /**
   * Filters contacts based on the provided name.
   * @param {string} name - The name to filter contacts.
   */
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

  /**
   * Selects or deselects a contact.
   * @param {any} event - The event triggering the selection.
   * @param {any} selectedContact - The contact to be selected or deselected.
   */
  selectContact(event: any, selectedContact: any) {
    if (event.target.checked) {
      this.taskObject.assignedUsers.push(selectedContact);
    }
    else {
      let index = this.taskObject.assignedUsers.findIndex((contact: { uid: string; }) => contact.uid === selectedContact.uid);
      this.taskObject.assignedUsers.splice(index, 1);
    }
  }

  /**
   * Checks if a contact is assigned to the task.
   * @param {any} contact - The contact to check.
   * @returns {boolean} True if the contact is assigned, false otherwise.
   */
  contactIsAssigned(contact: any) {
    if (this.taskObject.assignedUsers.includes((user: { uid: string; }) => user.uid == contact.uid)) return true;
    else return false;
  }

  /**
   * Deletes a subtask.
   * @param {string} subtask - The subtask to be deleted.
   */
  deleteSubtask(subtask: string) {
    let index = this.taskData.subtasks.indexOf((subtask));
    this.taskData.subtasks.splice(index, 1);
  }

  /**
   * Opens the edit mode for a subtask.
   * @param {any} subtask - The subtask to be edited.
   */
  openEditInput(subtask: any) {
    let index = this.taskData.subtasks.indexOf(subtask);
    this.taskData.subtasks[index].editMode = true;
    this.editedSubtask = subtask.name;
  }

  /**
   * Updates a subtask.
   * @param {any} subtask - The subtask to be updated.
   * @param {string} updatedSubtask - The updated subtask value.
   */
  updateSubtask(subtask: any, updatedSubtask: string) {
    let index = this.taskData.subtasks.findIndex((task: { name: string; }) => task.name === subtask.name);
    this.taskData.subtasks[index].name = updatedSubtask;
    this.taskData.subtasks[index].editMode = false;
  }

  /**
   * Clears the subtask input field.
   */
  clearSubtaskInput() {
    this.subtaskFocused = false;
    this.subtask = '';
  }

  /**
   * Adds a subtask.
   */
  addSubtask() {
    let subtask = {
      name: this.subtask.trim(),
      editMode: false
    };
    if (this.subtask.trim() != '' && this.taskData.subtasks.length < 2) {
      this.taskData.subtasks.push(subtask);
      this.subtask = '';
    }
  }

  /**
   * Saves changes made to the task.
   */
  saveChanges() {
    if (this.taskObject.title == '') this.titleValidationErr = true;
    if (this.taskObject.dueDate == '') this.dateValidationErr = true;
    if (this.taskObject.title != '' && this.taskObject.dueDate != '') {
      this.titleValidationErr = false;
      this.dateValidationErr = false;
      this.taskService.updateTask(this.taskObject);
      this.dialog.closeAll();
    }
  }

  /**
   * Deletes the task.
   */
  deleteTask() {
    this.taskService.deleteTask(this.taskObject);
    this.dialog.closeAll();
  }

}


