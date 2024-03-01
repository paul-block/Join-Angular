import { Component, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication.service';
import { ContactService } from 'src/services/contact.service';
import { TaskService } from 'src/services/task.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  title: string = '';
  description: string = '';
  contactInput: string = '';
  dueDate: string = '';
  prio: string = '';
  category: string = '';
  subtask: string = '';

  showAssignDropDown: boolean = false;
  showCategoryDropDown: boolean = false;
  subtaskFocused: boolean = false;

  selectableCategories: string[] = ['Technical Task', 'User Story'];
  selectedContacts: any[] = [];
  addedSubtasks: any[] = [];

  editedSubtask: string = '';

  currentUserContacts: any;
  contactsSubscription: Subscription | null = null;
  today: string;

  addedTask: boolean = false;
  showConfirmation: boolean = false;
  mobileView: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    if (event.target.innerWidth < 1000) this.mobileView = true;
    else this.mobileView = false;
  }

  constructor(private taskService: TaskService,
    private router: Router,
    public authService: AuthenticationService,
    public contactService: ContactService,
    private dialog: MatDialog) {
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.checkScreensize();
    this.contactsSubscription = this.contactService.getContactsForCurrentUser()
      .subscribe((contacts) => {
        this.currentUserContacts = contacts;
      });
    setTimeout(() => {
      this.showConfirmation = true;
    }, 4000);
  }

  /**
   * Checks the screen size and sets mobileView accordingly.
   */
  checkScreensize() {
    if (window.innerWidth <= 1000) this.mobileView = true;
    else this.mobileView = false;
  }

  /**
   * Creates a task object based on user input.
   * @returns {Object} The created task object.
   */
  createTaskObject() {
    const selectedUsersId = this.selectedContacts.map((contact) => contact.uid);
    const task = {
      assignedUserIDs: selectedUsersId,
      assignedUsers: this.selectedContacts,
      category: this.category,
      description: this.description,
      dueDate: this.dueDate,
      prio: this.prio,
      status: 'todo',
      subtasks: this.addedSubtasks,
      title: this.title,
    };
    return task;
  }

  /**
   * Sets the priority of the task.
   * @param {string} priority - The priority value to be set.
   */
  setPriority(priority: string) {
    this.prio = '';
    this.prio = priority;
  }

  /**
   * Adds a task.
   */
  async addTask() {
    this.addedTask = true;
    this.selectedContacts.push(this.authService.userData);
    this.dialog.closeAll();
    await this.taskService.addTask(this.createTaskObject());
    this.clearTask();
    this.router.navigate(['/board']);
  }

  /**
   * Clears the task input fields.
   */
  clearTask() {
    this.title = '';
    this.description = '';
    this.contactInput = '';
    this.dueDate = '';
    this.prio = '';
    this.category = '';
    this.subtask = '';
    this.selectedContacts = [];
  }

  /**
   * Adds a subtask.
   */
  addSubtask() {
    let subtask = {
      name: this.subtask.trim(),
      editMode: false,
      done: false
    };
    if (this.subtask.trim() != '' && this.addedSubtasks.length < 2) {
      this.addedSubtasks.push(subtask);
      this.subtask = '';
    }
  }

  /**
   * Deletes a subtask.
   * @param {string} subtask - The subtask to be deleted.
   */
  deleteSubtask(subtask: string) {
    let index = this.addedSubtasks.indexOf((subtask));
    this.addedSubtasks.splice(index, 1);
  }

  /**
   * Opens the edit mode for a subtask.
   * @param {any} subtask - The subtask to be edited.
   */
  openEditInput(subtask: any) {
    let index = this.addedSubtasks.indexOf(subtask);
    this.addedSubtasks[index].editMode = true;
    this.editedSubtask = subtask.name;
  }

  /**
   * Updates a subtask.
   * @param {any} subtask - The subtask to be updated.
   * @param {string} updatedSubtask - The updated subtask value.
   */
  updateSubtask(subtask: any, updatedSubtask: string) {
    let index = this.addedSubtasks.findIndex(task => task.name === subtask.name);
    this.addedSubtasks[index].name = updatedSubtask;
    this.addedSubtasks[index].editMode = false;
  }

  /**
   * Clears the subtask input field.
   */
  clearSubtaskInput() {
    this.subtaskFocused = false;
    this.subtask = '';
  }

  /**
   * Toggles dropdown visibility.
   * @param {string} dropDownName - The name of the dropdown to toggle.
   */
  toggleDropdown(dropDownName: string) {
    if (dropDownName === 'assign') this.showAssignDropDown = !this.showAssignDropDown;
    if (dropDownName === 'category') this.showCategoryDropDown = !this.showCategoryDropDown;
  }

  /**
   * Selects a contact.
   * @param {any} event - The event triggering the selection.
   * @param {any} selectedContact - The contact to be selected.
   */
  selectContact(event: any, selectedContact: any) {
    if (event.target.checked) {
      selectedContact.marked = true;
      this.selectedContacts.push(selectedContact);
    }
    else {
      let index = this.selectedContacts.findIndex(contact => contact.name === selectedContact.name);
      this.selectedContacts[index].marked = false;
      this.selectedContacts.splice(index, 1);
    }
  }

  /**
   * Selects a category.
   * @param {string} category - The category to be selected.
   */
  selectCategory(category: string) {
    this.category = category;
    this.showCategoryDropDown = false;
  }

  /**
   * Gets initials from a name.
   * @param {string} name - The name from which to extract initials.
   * @returns {string} The initials extracted from the name.
   */
  getInitials(name: string) {
    let initials = name.split(' ').map(word => word.charAt(0)).join('');
    return initials;
  }

  /**
   * Filters contacts based on the provided name.
   * @param {string} name - The name to filter contacts.
   */
  filterContacts(name: string) {
    if (name.trim() !== '') {
      let filteredContacts = this.currentUserContacts.filter((contact: { name: string; }) => contact.name.toLowerCase().startsWith(name.trim().toLowerCase()));
      this.currentUserContacts = filteredContacts;
    }
    else {
      this.contactService.getContactsForCurrentUser()
        .subscribe((contacts) => {
          this.currentUserContacts = contacts;
        });
    }
  }
}