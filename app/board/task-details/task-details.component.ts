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
  editTitle:string = '';
  currentUserContacts:any;
  contactInput:string = '';
  selectedContacts:any;
  subtaskFocused:boolean = false;
  subtask: string = '';
  editedSubtask:string = '';
  showSubtaskIcons:boolean = false;

  taskObject:any;

  constructor(private dialog: MatDialog,
    private taskService: TaskService,
    private contactService: ContactService,
    public authService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public taskData: any){
     
    }

    ngOnInit() {
      this.taskObject = this.taskData;
      console.log(this.taskObject);
    }

    // Noch nicht funktionsfähig
    checkSubtask(subtask:any){
      subtask.done != subtask.done;
    }

    close(){
      this.dialog.closeAll();
    }

    setPriority(priority:string) {
      this.taskData.prio = priority;
    }

    getInitials(name: string) {
      let initials = name.split(' ').map(word => word.charAt(0)).join('');
      return initials
    }
  
    activateEditMode() {
      this.showEditMode = true;
    }

    toggleDropdown(dropDownName: string) {
      if (dropDownName === 'assign') this.showAssignDropDown =! this.showAssignDropDown;
    }

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

  selectContact(event:any, selectedContact:any) {
    if (event.target.checked) {
      selectedContact.marked = true;
      this.taskData.push(selectedContact);
    }
    else {
      let index = this.taskData.assignedUsers.findIndex((contact: { name: string; }) => contact.name === selectedContact.name)
      this.taskData.assignedUsers[index].marked = false;
      this.taskData.assignedUsers.splice(index, 1)
    }
  }

  deleteSubtask(subtask:string) {
    let index = this.taskData.subtasks.indexOf((subtask))
    this.taskData.subtasks.splice(index, 1);
  }

  openEditInput(subtask: any){
  let index = this.taskData.subtasks.indexOf(subtask);
  this.taskData.subtasks[index].editMode = true;
  this.editedSubtask = subtask.name;
  }

  updateSubtask(subtask:any, updatedSubtask: string){
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
    }
    if (this.subtask.trim() != '' && this.taskData.subtasks.length < 2) {
      this.taskData.subtasks.push(subtask)
      this.subtask = '';
      console.log(this.taskData.subtasks)
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


